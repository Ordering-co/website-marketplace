import test from 'node:test'
import assert from 'node:assert/strict'
import { promises as fs } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import net from 'node:net'
import { configure, restore, availablePort, validateConfig } from '../../scripts/marketplace/core.mjs'
import { localMarketplaceConfig } from '../../scripts/marketplace/local-config-plugin.mjs'

const data = { schemaVersion: 1, product: 'website-marketplace', project: 'authorized', api: { url: 'https://api.ordering.co', language: 'en', version: 'v400' }, socket: { url: 'https://sockets-v3.orderingplus.com' }, app_id: 'web_marketplace_26', app_internal_name: 'website', use_marketplace: false, use_kiosk: false, use_project_domain: false, use_project_subdomain: false, businessSlug: '', franchiseSlug: null, url_dashboard: 'https://dashboard.ordering.co', _local_project_pin: true, verification: { identity: true, project: true, configuration: true, catalog: true }, admin_token: 'forbidden' }
async function checkout (t) { const root = await fs.mkdtemp(path.join(os.tmpdir(), 'marketplace-config-test-')); await fs.mkdir(path.join(root, 'src')); t.after(() => fs.rm(root, { recursive: true, force: true })); return root }
test('Repeated setup preserves customizations and original source config', async t => {
  const root = await checkout(t); await fs.writeFile(path.join(root, 'src/config.json'), '{"source":"unchanged"}')
  const first = await configure(root, data, 'authorized'); assert.equal(first.changed, true)
  const file = path.join(root, 'src/config.local.json'); const custom = JSON.parse(await fs.readFile(file, 'utf8')); custom.app_name = 'My brand'; custom.api.timeout = 12; await fs.writeFile(file, JSON.stringify(custom))
  await configure(root, data, 'authorized'); assert.equal((await configure(root, data, 'authorized')).changed, false)
  const result = JSON.parse(await fs.readFile(file, 'utf8')); assert.equal(result.app_name, 'My brand'); assert.equal(result.api.timeout, 12); assert.equal(result.admin_token, undefined)
  assert.equal(await fs.readFile(path.join(root, 'src/config.json'), 'utf8'), '{"source":"unchanged"}')
})
test('Wrong project and partial failure do not replace config; recovery is reversible', async t => {
  const root = await checkout(t); const file = path.join(root, 'src/config.local.json'); const original = '{"app_name":"Brand"}\n'; await fs.writeFile(file, original)
  await assert.rejects(configure(root, data, 'foreign'), /project_mismatch/); assert.equal(await fs.readFile(file, 'utf8'), original)
  await configure(root, data, 'authorized'); await restore(root); assert.equal(await fs.readFile(file, 'utf8'), original)
  // Force replacement failure after receipt/backup are prepared.
  await fs.unlink(file); await fs.mkdir(file); await assert.rejects(configure(root, data, 'authorized')); await fs.rmdir(file)
  await configure(root, data, 'authorized'); await restore(root); await assert.rejects(fs.access(file))
})
test('Changing project requires explicit reconnect and keeps previous config', async t => {
  const root = await checkout(t); await configure(root, data, 'authorized'); const changed = { ...data, project: 'other' }
  await assert.rejects(configure(root, changed, 'other'), /reconnect_required/); await configure(root, changed, 'other', true); await restore(root); assert.equal(JSON.parse(await fs.readFile(path.join(root, 'src/config.local.json'), 'utf8')).project, 'authorized')
})
test('Secrets are omitted and mode, public validation and endpoints cannot be forged', () => {
  assert.equal(validateConfig(data, 'authorized').admin_token, undefined)
  for (const changed of [{ ...data, use_marketplace: true }, { ...data, businessSlug: 'store' }, { ...data, api: { ...data.api, url: 'https://attacker.test' } }, { ...data, verification: { ...data.verification, catalog: false } }]) assert.throws(() => validateConfig(changed, 'authorized'))
})
test('An occupied port is skipped and its owner keeps listening', async t => {
  const owner = net.createServer(); await new Promise(resolve => owner.listen(0, '127.0.0.1', resolve)); t.after(() => owner.close()); const port = owner.address().port
  assert.equal(await availablePort('127.0.0.1', port), port + 1); assert.equal(owner.listening, true)
})
test('Dev config is watched; production ignores local project entirely', async t => {
  const root = await checkout(t); await fs.writeFile(path.join(root, 'src/config.local.json'), JSON.stringify({ project: 'private-local-project' }))
  const plugin = localMarketplaceConfig(); const id = plugin.resolveId('virtual:marketplace-local-config'); const context = { addWatchFile () {} }
  plugin.configResolved({ command: 'serve', root }); assert.match(plugin.load.call(context, id), /private-local-project/)
  plugin.configResolved({ command: 'build', root }); assert.equal(plugin.load.call(context, id), 'export default {}')
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { validateProjectSelection } from '../../scripts/marketplace/connection/scripts/marketplace-config.mjs'

test('selected portal project is used automatically without MCP/REST keys or copied identity', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'marketplace-selection-test-')); t.after(() => fs.rm(root, { recursive: true, force: true }))
  await fs.mkdir(path.join(root, 'scripts'))
  await fs.copyFile(new URL('../../scripts/marketplace/connection/scripts/marketplace-config.mjs', import.meta.url), path.join(root, 'scripts/marketplace-config.mjs'))
  const script = path.join(root, 'scripts/marketplace-config.mjs')
  const env = { ...process.env }; delete env.ORDERING_PROJECT; delete env.ORDERING_MCP_KEY; delete env.ORDERING_API_KEY
  const run = (args, input) => execFileSync(process.execPath, [script, ...args], { input, env, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] })
  assert.deepEqual(JSON.parse(run(['--connection'])), { status: 'none' })
  const selected = { v: 1, project: 'selected-in-browser', source: 'portal' }
  assert.equal(JSON.parse(run(['--save-selection'], JSON.stringify(selected))).credentialsCreated, false)
  const result = JSON.parse(run(['--connection'])); assert.equal(result.project, selected.project); assert.equal(result.authenticated, false)
  assert.equal(await fs.readFile(path.join(root, '.marketplace-project.json'), 'utf8'), JSON.stringify(selected) + '\n')
  await assert.rejects(fs.access(path.join(root, '.env')))
  assert.throws(() => run(['--save-selection'], JSON.stringify({ ...selected, key: 'forbidden' })))
  assert.equal(validateProjectSelection(selected).project, selected.project)
})

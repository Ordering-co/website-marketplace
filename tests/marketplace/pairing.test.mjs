import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn, execFileSync } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import net from 'node:net'
import { randomBytes } from 'node:crypto'

const root = new URL('../../', import.meta.url)
test('Bundled helper preserves private delivery, cancellation/expiry and global client isolation', async t => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'marketplace-bundled-pairing-'))
  t.after(() => fs.rm(directory, { recursive: true, force: true }))
  const listener = net.createServer(); await new Promise(resolve => listener.listen(0, '127.0.0.1', resolve)); const port = listener.address().port; await new Promise(resolve => listener.close(resolve))
  const base = 'http://127.0.0.1:' + port
  const relay = spawn('python3', [new URL('fixtures/relay.py', import.meta.url).pathname, String(port)], { stdio: 'ignore' })
  t.after(() => relay.kill())
  for (let i = 0; i < 50; i++) { try { await fetch(base); break } catch { await new Promise(resolve => setTimeout(resolve, 50)) } }
  await fs.cp(new URL('scripts/marketplace/connection/', root), path.join(directory, 'connection'), { recursive: true, filter: source => !['.env', '.login', '.clients'].includes(path.basename(source)) })
  const helper = path.join(directory, 'connection/ordering')
  const env = { ...process.env, ORDERING_CONNECT_URL: base, ORDERING_API_HOST: base, ORDERING_LOGIN_SKIP_DOCTOR: '1', ORDERING_NO_BROWSER: '1', PAGE_API_BASE: base }
  delete env.ORDERING_PROJECT; delete env.ORDERING_MCP_KEY; delete env.ORDERING_API_KEY
  const run = args => execFileSync(helper, args, { env, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
  const start = () => {
    const output = run(['login', 'start', '--client', 'codex'])
    const link = /http:\/\/[^\s]+\/connect\/\?product=website-marketplace#[a-f0-9.]+/.exec(output)?.[0]
    const code = /type this code: ([A-F0-9-]+)/.exec(output)?.[1]
    assert.ok(link); assert.match(code, /^[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}$/)
    return { link, code }
  }
  let pair = start()
  const fixtureKey = 'ord_mcp_test' + randomBytes(18).toString('hex')
  execFileSync(process.execPath, [new URL('fixtures/page.mjs', import.meta.url).pathname, base, pair.link, pair.code, 'authorized', fixtureKey], { env, stdio: 'ignore' })
  assert.match(run(['login', 'wait', '--timeout', '10']), /Signed in/)
  const privateEnv = await fs.readFile(path.join(directory, 'connection/.env'), 'utf8')
  assert.match(privateEnv, /ORDERING_PROJECT=authorized/)
  assert.equal((await fs.stat(path.join(directory, 'connection/.env'))).mode & 0o777, 0o600)
  await assert.rejects(fs.access(path.join(directory, 'connection/.login')))
  pair = start()
  await fetch(base + '/__test/cancel', { method: 'POST' })
  assert.throws(() => run(['login', 'wait', '--timeout', '1']), error => error.status !== 0 && /expired or was cancelled/.test(String(error.stderr)))
  assert.equal(await fs.readFile(path.join(directory, 'connection/.env'), 'utf8'), privateEnv)
  start()
  await fs.writeFile(path.join(directory, 'connection/.login/expires'), '1\n')
  assert.throws(() => run(['login', 'wait', '--timeout', '1']), error => error.status !== 0 && /expired/.test(String(error.stderr)))
  assert.equal(await fs.readFile(path.join(directory, 'connection/.env'), 'utf8'), privateEnv)
  const projectStart = run(['project-login', 'start', '--client', 'codex'])
  const projectLink = /http:\/\/[^\s]+\/connect\/\?product=website-marketplace&purpose=project#[a-f0-9.]+/.exec(projectStart)?.[0]
  const projectCode = /type this code: ([A-F0-9-]+)/.exec(projectStart)?.[1]
  assert.ok(projectLink)
  execFileSync(process.execPath, [new URL('fixtures/page.mjs', import.meta.url).pathname, base, projectLink, projectCode, 'other-selected', '', 'project-only'], { env, stdio: 'ignore' })
  assert.match(run(['project-login', 'wait', '--timeout', '10']), /No MCP or REST key created/)
  const selected = JSON.parse(await fs.readFile(path.join(directory, 'connection/.marketplace-project.json'), 'utf8'))
  assert.equal(selected.project, 'other-selected')
  assert.equal(await fs.readFile(path.join(directory, 'connection/.env'), 'utf8'), privateEnv)
  assert.equal(JSON.parse(run(['marketplace-project'])).project, 'other-selected')
  assert.throws(() => run(['install']), error => /global clients remain untouched/.test(String(error.stderr)))
  const source = await fs.readFile(helper, 'utf8')
  assert.match(source, /export ORDERING_LOGIN_SKIP_PLUGIN=1/)
})

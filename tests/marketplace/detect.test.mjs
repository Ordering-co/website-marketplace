import test from 'node:test'
import assert from 'node:assert/strict'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { inspectExistingLauncher, detectExistingConnection } from '../../scripts/marketplace/detect.mjs'

test('already connected launcher exposes only project; performs whoami once and preserves private files', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'marketplace-mcp-detect-')); t.after(() => fs.rm(root, { recursive: true, force: true }))
  const launcher = path.join(root, 'ordering')
  await fs.writeFile(launcher, `#!${process.execPath}\nconst readline=require('node:readline');readline.createInterface({input:process.stdin}).on('line',line=>{const m=JSON.parse(line);if(m.id===1)console.log(JSON.stringify({jsonrpc:'2.0',id:1,result:{protocolVersion:'2025-03-26',capabilities:{},serverInfo:{name:'fixture',version:'1'}}}));if(m.id===2)console.log(JSON.stringify({jsonrpc:'2.0',id:2,result:{structuredContent:{project:'existing',user:{id:1,email:'private@example.test'},token:{scope:'write',prefix:'redacted'}}}}));});\n`, { mode: 0o755 })
  const result = await inspectExistingLauncher(launcher)
  assert.deepEqual(result, { status: 'connected', project: 'existing', source: 'existing-launcher', authenticated: true })
  assert.equal(JSON.stringify(result).includes('private@example.test'), false)
  assert.equal((await fs.readdir(root)).length, 1)
})
test('missing/unprepared installed launcher is not installed or mutated', async t => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'marketplace-mcp-absent-')); t.after(() => fs.rm(root, { recursive: true, force: true }))
  assert.deepEqual(await detectExistingConnection(root), { status: 'none' })
  assert.deepEqual(await fs.readdir(root), [])
})

import { spawn } from 'node:child_process'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import os from 'node:os'

// Probe an already prepared, known Ordering launcher. No .env/key is read here,
// no client is installed/reloaded, and no arbitrary server config is executed.
export async function inspectExistingLauncher (launcher, timeoutMs = 15000) {
  return new Promise(resolve => {
    const child = spawn(launcher, ['mcp'], { stdio: ['pipe', 'pipe', 'ignore'] })
    let buffered = ''; let finished = false
    const complete = result => { if (finished) return; finished = true; clearTimeout(timer); child.stdin.end(); child.kill('SIGTERM'); resolve(result) }
    const timer = setTimeout(() => complete({ status: 'unavailable' }), timeoutMs)
    const send = message => child.stdin.write(JSON.stringify(message) + '\n')
    child.on('error', () => complete({ status: 'unavailable' }))
    child.on('exit', () => complete({ status: 'unavailable' }))
    child.stdin.on('error', () => complete({ status: 'unavailable' }))
    child.stdout.on('data', chunk => {
      buffered += chunk.toString()
      if (buffered.length > 65536) return complete({ status: 'unavailable' })
      let end
      while ((end = buffered.indexOf('\n')) >= 0) {
        const line = buffered.slice(0, end); buffered = buffered.slice(end + 1)
        let message
        try { message = JSON.parse(line) } catch { continue }
        if (message.id === 1) {
          if (message.error || !message.result) return complete({ status: 'unavailable' })
          send({ jsonrpc: '2.0', method: 'notifications/initialized' })
          send({ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'whoami', arguments: {} } })
        } else if (message.id === 2) {
          const identity = message.result?.structuredContent
          if (message.error || message.result?.isError || !/^[a-z0-9_-]+$/.test(identity?.project || '') || !identity.user?.id || !['read', 'write'].includes(identity.token?.scope)) return complete({ status: 'unavailable' })
          complete({ status: 'connected', project: identity.project, source: 'existing-launcher', authenticated: true })
        }
      }
    })
    send({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26', capabilities: {}, clientInfo: { name: 'website-marketplace-project-detection', version: '1.0.0' } } })
  })
}

export async function detectExistingConnection (home = os.homedir()) {
  const root = path.join(home, 'ordering-dev-quickstart')
  try {
    await fs.access(path.join(root, 'ordering'))
    await fs.access(path.join(root, '.clients/runtime-ready'))
  } catch { return { status: 'none' } }
  return inspectExistingLauncher(path.join(root, 'ordering'))
}

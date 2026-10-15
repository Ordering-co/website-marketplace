import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync, spawn } from 'node:child_process'
import { exportPublicMarketplaceConfig, catalogQuery } from './connection/scripts/marketplace-config.mjs'
import { detectExistingConnection } from './detect.mjs'
import { availablePort, configure, restore } from './core.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const args = process.argv.slice(2)
const command = args.shift()
const option = name => { const index = args.indexOf('--' + name); return index < 0 ? null : args[index + 1] }
function environment () {
  const pkg = JSON.parse(execFileSync(process.execPath, ['-e', 'process.stdout.write(require("fs").readFileSync("package.json","utf8"))'], { cwd: root, encoding: 'utf8' }))
  if (Number(process.versions.node.split('.')[0]) !== 24) throw new Error('Use Node 24 from .nvmrc / NODE_VERSION.txt')
  const version = execFileSync('pnpm', ['--version'], { cwd: root, encoding: 'utf8' }).trim()
  if ('pnpm@' + version !== pkg.packageManager) throw new Error('Use ' + pkg.packageManager + ' from package.json')
}
try {
  if (command === 'doctor') {
    environment()
    await fs.access(path.join(root, 'pnpm-lock.yaml'))
    await fs.access(path.join(root, 'src/@/components/src/contexts/OrderingContext/index.js'))
    console.log('Node 24, pinned pnpm, lockfile and shared components: verified')
    const local = JSON.parse(await fs.readFile(path.join(root, 'src/config.local.json'), 'utf8'))
    console.log('Local project: ' + local.project + '; API: ' + local.api.url + '/' + local.api.version + '/' + local.api.language + '; app: ' + local.app_id)
    const base = `${local.api.url}/${local.api.version}/${local.api.language}/${local.project}`
    const current = await fetch(base + '/current', { redirect: 'error', signal: AbortSignal.timeout(20000) }).then(r => r.ok ? r.json() : Promise.reject(new Error('API HTTP ' + r.status)))
    if (current.error !== false || current.result?.code !== local.project) throw new Error('project_mismatch')
    const configs = await fetch(base + '/configs', { redirect: 'error', signal: AbortSignal.timeout(20000) }).then(r => r.json())
    if (configs.error !== false) throw new Error('configuration_unavailable')
    const catalog = await fetch(base + '/businesses?' + catalogQuery(configs.result), { redirect: 'error', signal: AbortSignal.timeout(20000) }).then(r => r.ok ? r.json() : Promise.reject(new Error('Catalog HTTP ' + r.status)))
    if (catalog.error !== false || !Array.isArray(catalog.result)) throw new Error('catalog_unavailable')
    console.log('Public project identity and catalog read: verified; returned businesses: ' + catalog.result.length)
  } else if (command === 'connection') {
    const helper = option('helper') || path.join(root, 'scripts/marketplace/connection/ordering')
    let output
    try { output = execFileSync(helper, ['marketplace-project'], { encoding: 'utf8', maxBuffer: 16384, stdio: ['ignore', 'pipe', 'ignore'], timeout: 30000 }) } catch { throw new Error('Existing connection could not be verified; preserve it and use project selection') }
    let selected = JSON.parse(output)
    if (selected.status === 'none') selected = await detectExistingConnection()
    console.log(JSON.stringify({ status: selected.status, ...(selected.project ? { project: selected.project, source: selected.source } : {}) }))
  } else if (command === 'configure') {
    const project = option('project')
    const publicProject = option('public-project')
    const helper = option('helper') || path.join(root, 'scripts/marketplace/connection/ordering')
    let output
    let data
    if (publicProject) {
      if (project && project !== publicProject) throw new Error('project_mismatch')
      data = await exportPublicMarketplaceConfig({ project: publicProject })
    } else {
      try { output = execFileSync(helper, ['marketplace-config', project || ''], { encoding: 'utf8', maxBuffer: 16384, stdio: ['ignore', 'pipe', 'inherit'], timeout: 120000 }) } catch { throw new Error('Connection export failed; local configuration was preserved') }
      data = JSON.parse(output)
    }
    console.log(JSON.stringify(await configure(root, data, project || publicProject || data.project, args.includes('--reconnect'))))
  } else if (command === 'restore') {
    await restore(root)
    console.log('Previous configuration restored; current copy kept in .marketplace-local')
  } else if (command === 'start') {
    environment()
    const local = JSON.parse(await fs.readFile(path.join(root, 'src/config.local.json'), 'utf8'))
    if (!local._local_project_pin || !local.project) throw new Error('Run configure before starting')
    const host = option('host') || '127.0.0.1'
    if (host !== '127.0.0.1' && !/^100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d{1,3}\.\d{1,3}$/.test(host)) throw new Error('Use localhost or the current private Tailscale IPv4 address')
    const port = await availablePort(host)
    const child = spawn('pnpm', ['exec', 'vite', '--host', host, '--port', String(port), '--strictPort'], { cwd: root, stdio: 'inherit' })
    console.log('Local preview for ' + local.project + ': http://' + host + ':' + port + '/ (depends on this process and private network)')
    process.on('SIGTERM', () => child.kill('SIGTERM'))
    process.on('SIGINT', () => child.kill('SIGINT'))
    child.on('exit', code => { process.exitCode = code ?? 1 })
  } else throw new Error('Usage: marketplace:doctor | marketplace:connection [--helper PATH] | marketplace:configure [--public-project DETECTED_PROJECT] [--project ASSERTION] [--helper PATH] [--reconnect] | marketplace:start [--host PRIVATE_IP] | marketplace:restore')
} catch (error) { console.error(error.message); process.exitCode = 1 }

import { promises as fs } from 'node:fs'
import path from 'node:path'
import net from 'node:net'
import { createHash } from 'node:crypto'

export function validateConfig (data, project) {
  if (data?.schemaVersion !== 1 || data.product !== 'website-marketplace' || data.project !== project || !/^[a-z0-9_-]+$/.test(project || '')) throw new Error('project_mismatch')
  if (data.api?.url !== 'https://api.ordering.co' || data.api?.version !== 'v400' || !/^[a-z]{2}(?:-[A-Za-z]{2})?$/.test(data.api?.language || '')) throw new Error('invalid_api')
  if (data.socket?.url !== 'https://sockets-v3.orderingplus.com' || data.app_id !== 'web_marketplace_26' || data.app_internal_name !== 'website' || data.url_dashboard !== 'https://dashboard.ordering.co') throw new Error('invalid_product')
  if (!data._local_project_pin || data.businessSlug || data.franchiseSlug || data.use_kiosk || data.use_marketplace || data.use_project_domain || data.use_project_subdomain) throw new Error('invalid_marketplace_mode')
  if (!['project', 'configuration', 'catalog'].every(key => data.verification?.[key] === true)) throw new Error('unverified_configuration')
  const keys = ['project', 'api', 'socket', 'app_id', 'app_internal_name', 'use_marketplace', 'use_project_domain', 'use_project_subdomain', 'use_kiosk', 'businessSlug', 'franchiseSlug', 'url_dashboard', '_local_project_pin']
  return Object.fromEntries(keys.map(key => [key, data[key]]))
}

export async function configure (root, data, project, reconnect = false) {
  const publicConfig = validateConfig(data, project)
  const target = path.join(root, 'src/config.local.json')
  let old = null
  try { old = await fs.readFile(target, 'utf8') } catch (error) { if (error.code !== 'ENOENT') throw error }
  const previous = old ? JSON.parse(old) : {}
  if (previous.project && previous.project !== project && !reconnect) throw new Error('reconnect_required')
  // Preserve presentation and other customer fields. Connection fields are validated and owned by setup.
  const next = JSON.stringify({ ...previous, ...publicConfig, api: { ...previous.api, ...publicConfig.api }, socket: { ...previous.socket, ...publicConfig.socket } }, null, 2) + '\n'
  if (next === old) return { changed: false, project }
  const state = path.join(root, '.marketplace-local')
  await fs.mkdir(state, { recursive: true, mode: 0o700 })
  const backup = old === null ? 'absent' : createHash('sha256').update(old).digest('hex') + '.json'
  if (old !== null) await fs.writeFile(path.join(state, backup), old, { mode: 0o600, flag: 'wx' }).catch(error => { if (error.code !== 'EEXIST') throw error })
  // Receipt is written before replacement; an interrupted write is recoverable.
  await fs.writeFile(path.join(state, 'recovery.json'), JSON.stringify({ backup, target: 'src/config.local.json' }), { mode: 0o600 })
  const temporary = target + '.' + process.pid + '.tmp'
  await fs.writeFile(temporary, next, { mode: 0o600, flag: 'wx' })
  await fs.rename(temporary, target)
  return { changed: true, project, backup }
}

export async function restore (root) {
  const state = path.join(root, '.marketplace-local')
  const receipt = JSON.parse(await fs.readFile(path.join(state, 'recovery.json'), 'utf8'))
  if (receipt.target !== 'src/config.local.json' || !/^(?:absent|[a-f0-9]{64}\.json)$/.test(receipt.backup)) throw new Error('invalid_recovery')
  const target = path.join(root, receipt.target)
  const current = await fs.readFile(target, 'utf8').catch(error => { if (error.code === 'ENOENT') return null; throw error })
  if (current !== null) await fs.writeFile(path.join(state, 'before-restore-' + createHash('sha256').update(current).digest('hex') + '.json'), current, { mode: 0o600 })
  if (receipt.backup === 'absent') await fs.unlink(target).catch(error => { if (error.code !== 'ENOENT') throw error })
  else await fs.copyFile(path.join(state, receipt.backup), target)
}

export async function availablePort (host, start = 3000) {
  for (let port = start; port < start + 50 && port <= 65535; port++) {
    const free = await new Promise((resolve, reject) => {
      const server = net.createServer()
      server.once('error', error => error.code === 'EADDRINUSE' ? resolve(false) : reject(error))
      server.listen(port, host, () => server.close(() => resolve(true)))
    })
    if (free) return port
  }
  throw new Error('no_available_port')
}

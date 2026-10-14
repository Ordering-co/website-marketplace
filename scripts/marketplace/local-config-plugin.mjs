import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

export function localMarketplaceConfig () {
  const id = 'virtual:marketplace-local-config'
  const resolved = '\0' + id
  let localPath
  let dev = false
  return {
    name: 'marketplace-local-config',
    configResolved (config) { dev = config.command === 'serve' && config.mode !== 'test'; localPath = path.join(config.root, 'src/config.local.json') },
    resolveId (source) { if (source === id) return resolved },
    load (source) {
      if (source !== resolved) return
      const settings = dev && existsSync(localPath) ? JSON.parse(readFileSync(localPath, 'utf8')) : {}
      if (dev && existsSync(localPath)) this.addWatchFile(localPath)
      return 'export default ' + JSON.stringify(settings)
    },
    handleHotUpdate ({ file, server }) {
      if (file !== localPath) return
      const module = server.moduleGraph.getModuleById(resolved)
      if (module) server.moduleGraph.invalidateModule(module)
      server.ws.send({ type: 'full-reload' })
      return []
    }
  }
}

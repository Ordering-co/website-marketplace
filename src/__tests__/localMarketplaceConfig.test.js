import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('../config.json', () => ({
  default: {
    project: 'source-fixture',
    api: { url: 'https://source.invalid', version: 'v400', language: 'en' },
    socket: { url: 'https://socket.invalid', sourceOnlyOption: true },
    sourceOnlyOption: true
  }
}))

const loadConfig = async (local = {}, runtime = {}) => {
  vi.resetModules()
  window.__CONFIG__ = runtime
  vi.doMock('virtual:marketplace-local-config', () => ({ default: local }))
  return (await import('../config')).default
}

describe('local setup preserves normal private source configuration', () => {
  afterEach(() => {
    delete window.__CONFIG__
    vi.doUnmock('virtual:marketplace-local-config')
    vi.resetModules()
  })

  it('keeps source settings unchanged without an explicit local setup', async () => {
    const settings = await loadConfig()
    expect(settings.project).toBe('source-fixture')
    expect(settings.api).toEqual({ url: 'https://source.invalid', version: 'v400', language: 'en' })
    expect(settings.socket).toEqual({ url: 'https://socket.invalid', sourceOnlyOption: true })
    expect(settings.sourceOnlyOption).toBe(true)
    expect(settings._local_project_pin).toBeUndefined()
  })

  it('retains the original Worker socket replacement and nested API precedence', async () => {
    const settings = await loadConfig({}, { project: 'worker-fixture', api: { language: 'es' }, socket: { url: 'https://worker.invalid' } })
    expect(settings.project).toBe('worker-fixture')
    expect(settings.api).toEqual({ url: 'https://source.invalid', version: 'v400', language: 'es' })
    expect(settings.socket).toEqual({ url: 'https://worker.invalid' })
  })

  it('applies a public local project only when explicitly pinned', async () => {
    const settings = await loadConfig({ project: 'local-fixture', _local_project_pin: true, socket: { url: 'https://local.invalid' } })
    expect(settings.project).toBe('local-fixture')
    expect(settings.socket).toEqual({ url: 'https://local.invalid', sourceOnlyOption: true })
    expect(settings.sourceOnlyOption).toBe(true)
  })

  it('rejects conflicting Worker and local projects', async () => {
    await expect(loadConfig({ project: 'local-fixture', _local_project_pin: true }, { project: 'worker-fixture' })).rejects.toThrow(/conflicts with Worker/)
  })
})

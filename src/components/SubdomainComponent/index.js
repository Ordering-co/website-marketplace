import { cloneElement, useEffect, useState } from 'react'
import settings from '../../config'
import {
  resolveBootstrapProject,
  resolveCurrentLookupProject
} from './resolveBootstrapProject'

// Runs in a root bootstrap component on every render — a corrupt/non-JSON
// "language" value must not throw and brick the whole app at boot.
const readStoredLanguage = () => {
  try {
    const raw = window.localStorage.getItem('language')
    return raw ? JSON.parse(raw) : null
  } catch (_) {
    return null
  }
}

export const SubdomainComponent = (props) => {
  const hostname = window.location.hostname
  const _language = readStoredLanguage()

  // The Cloudflare worker already resolves the real project server-side
  // (validateProjectViaCurrent) and injects it via window.__CONFIG__. When
  // present, trust it: re-deriving from the hostname yields '_' on hosts that
  // don't match the project domain (e.g. localhost previews) and triggers the
  // project-error redirect, plus a redundant /current round trip on boot.
  const workerResolvedProject = window.__CONFIG__?.project || null

  const [project, setProject] = useState(() => resolveBootstrapProject({
    workerProject: workerResolvedProject,
    hostname,
    settings,
    storedProject: window.localStorage.getItem('project')
  }))
  const [localLanguage] = useState(settings?.use_project_domain ? _language?.code : settings.api.language)

  useEffect(() => {
    const getProjectStatus = async () => {
      const { url, language, version } = settings.api
      const lookupProject = resolveCurrentLookupProject({
        hostname,
        settings,
        storedProject: window.localStorage.getItem('project')
      })

      try {
        const response = await fetch(`${url}/${version}/${language}/${lookupProject}/current`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        const { error, result } = await response.json()

        const nextProject = !error ? result?.code : settings?.project
        if (error) {
          window.open(settings?.project_error_redirect_url, '_self')
        }
        setProject(nextProject)
      } catch (error) {
        setProject(lookupProject ?? settings?.project)
      }
    }

    if (settings?.use_project_domain && !workerResolvedProject) {
      getProjectStatus()
    }
  }, [])

  return (
    cloneElement(props.children, {
      settings: {
        ...settings,
        api: {
          ...settings.api,
          language: localLanguage
        },
        project
      }
    })
  )
}

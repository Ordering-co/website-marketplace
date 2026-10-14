import React from 'react'
import settings from '../../config'
import './styles.css'

// First local edit: change this label and watch Fast Refresh in the running preview.
const previewLabel = 'Local Marketplace preview'
export const LocalMarketplacePreview = () => settings._local_project_pin
  ? <aside className='local-marketplace-preview' aria-label='Local project'>{previewLabel} · {settings.project}</aside>
  : null

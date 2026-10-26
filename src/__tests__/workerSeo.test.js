import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildSiteSeoFallback, mergeSeoData } from '../../worker/seo.js'
import { DEFAULT_SEO_DESCRIPTION } from '../utils/seoDescription'

const themeWithValues = (values) => ({
  my_products: {
    components: {
      website_settings: {
        components: {
          values
        }
      }
    }
  }
})

const seoWithDescriptions = (description, ogDescription = description) => ({
  metas: [
    { name: 'description', content: description },
    { property: 'og:description', content: ogDescription }
  ]
})

const description = (merged) => merged.metas.find(m => m?.name === 'description')?.content
const ogDescription = (merged) => merged.metas.find(m => m?.property === 'og:description')?.content

describe('worker seo merge', () => {
  it('prefers a configured site description on general routes for both fields', () => {
    const site = { name: 'Tenant', description: 'Client description' }
    const merged = mergeSeoData(
      seoWithDescriptions('API description'),
      buildSiteSeoFallback(site, 'https://tenant.example/', null),
      { preferSite: true, site }
    )
    expect(description(merged)).toBe('Client description')
    expect(ogDescription(merged)).toBe('Client description')
  })

  it('uses the theme description when the site has none', () => {
    const site = { name: 'Tenant' }
    const theme = themeWithValues({ name: 'Tenant', description: 'Theme description' })
    const merged = mergeSeoData(
      null,
      buildSiteSeoFallback(site, 'https://tenant.example/', theme),
      { preferSite: true, site }
    )
    expect(description(merged)).toBe('Theme description')
    expect(ogDescription(merged)).toBe('Theme description')
  })

  it('prefers the site description over a differing theme description', () => {
    const site = { name: 'Tenant', description: 'Site description' }
    const theme = themeWithValues({ description: 'Theme description' })
    const merged = mergeSeoData(
      null,
      buildSiteSeoFallback(site, 'https://tenant.example/', theme),
      { preferSite: true, site }
    )
    expect(description(merged)).toBe('Site description')
    expect(ogDescription(merged)).toBe('Site description')
  })

  it('keeps valid SEO API descriptions on general routes when site and theme are blank', () => {
    const site = { name: 'Tenant', description: '   ' }
    const theme = themeWithValues({ description: ' ' })
    const merged = mergeSeoData(
      seoWithDescriptions('Configured SEO description'),
      buildSiteSeoFallback(site, 'https://tenant.example/', theme),
      { preferSite: true, site }
    )
    expect(description(merged)).toBe('Configured SEO description')
    expect(ogDescription(merged)).toBe('Configured SEO description')
  })

  it.each([true, false])(
    'emits exactly one of each default description when nothing valid is configured (preferSite=%s)',
    (preferSite) => {
      const site = { name: 'Tenant' }
      const merged = mergeSeoData(
        seoWithDescriptions('  ', null),
        buildSiteSeoFallback(site, 'https://tenant.example/', null),
        { preferSite, site }
      )
      expect(description(merged)).toBe(DEFAULT_SEO_DESCRIPTION)
      expect(ogDescription(merged)).toBe(DEFAULT_SEO_DESCRIPTION)
      expect(merged.metas.filter(m => m?.name === 'description')).toHaveLength(1)
      expect(merged.metas.filter(m => m?.property === 'og:description')).toHaveLength(1)
      for (const meta of merged.metas) {
        expect(String(meta.content)).not.toContain('ordering.inc')
        expect(String(meta.content)).not.toContain('OrderingPlus')
        expect(String(meta.content)).not.toContain('dummy description')
      }
    }
  )

  it.each([true, false])(
    'emits exactly one of each default description when every source is blank or a template (preferSite=%s)',
    (preferSite) => {
      const site = { name: 'Tenant', description: 'Food Marketplace by Ordering.co.' }
      const theme = themeWithValues({ description: '  ' })
      const merged = mergeSeoData(
        seoWithDescriptions('Food marketplace by ordering.inc', 'a dummy description about this page'),
        buildSiteSeoFallback(site, 'https://tenant.example/', theme),
        { preferSite, site }
      )
      expect(description(merged)).toBe(DEFAULT_SEO_DESCRIPTION)
      expect(ogDescription(merged)).toBe(DEFAULT_SEO_DESCRIPTION)
      expect(merged.metas.filter(m => m?.name === 'description')).toHaveLength(1)
      expect(merged.metas.filter(m => m?.property === 'og:description')).toHaveLength(1)
    }
  )

  it('lets a valid API description win when site and theme only carry the current default template', () => {
    const site = { name: 'Tenant', description: 'Food Marketplace by Ordering.co.' }
    const theme = themeWithValues({ description: 'food marketplace by ordering.co' })
    const merged = mergeSeoData(
      seoWithDescriptions('API description'),
      buildSiteSeoFallback(site, 'https://tenant.example/', theme),
      { preferSite: true, site }
    )
    expect(description(merged)).toBe('API description')
    expect(ogDescription(merged)).toBe('API description')
  })

  it('lets a valid site description win when the API only carries the current default template', () => {
    const site = { name: 'Tenant', description: 'Client description' }
    const merged = mergeSeoData(
      seoWithDescriptions('Food Marketplace by Ordering.co', 'FOOD MARKETPLACE BY ORDERING.CO.'),
      buildSiteSeoFallback(site, 'https://tenant.example/', null),
      { preferSite: false, site }
    )
    expect(description(merged)).toBe('Client description')
    expect(ogDescription(merged)).toBe('Client description')
  })

  it('fills a missing name description from a custom API og:description', () => {
    const site = { name: 'Tenant' }
    const merged = mergeSeoData(
      { metas: [{ property: 'og:description', content: 'Custom OG only' }] },
      buildSiteSeoFallback(site, 'https://tenant.example/', null),
      { preferSite: false, site }
    )
    expect(description(merged)).toBe('Custom OG only')
    expect(ogDescription(merged)).toBe('Custom OG only')
  })

  it('fills a missing og:description from a custom API description', () => {
    const site = { name: 'Tenant' }
    const merged = mergeSeoData(
      { metas: [{ name: 'description', content: 'Custom name only' }] },
      buildSiteSeoFallback(site, 'https://tenant.example/', null),
      { preferSite: false, site }
    )
    expect(description(merged)).toBe('Custom name only')
    expect(ogDescription(merged)).toBe('Custom name only')
  })

  it.each([true, false])(
    'lets the site fallback replace legacy or blank API descriptions (preferSite=%s)',
    (preferSite) => {
      const site = { name: 'Tenant', description: 'Client description' }
      const merged = mergeSeoData(
        seoWithDescriptions('Food marketplace by ordering.inc', '   '),
        buildSiteSeoFallback(site, 'https://tenant.example/', null),
        { preferSite, site }
      )
      expect(description(merged)).toBe('Client description')
      expect(ogDescription(merged)).toBe('Client description')
    }
  )

  it('lets page-specific API descriptions win and preserves a distinct custom OG', () => {
    const site = { name: 'Tenant', description: 'Site description' }
    const merged = mergeSeoData(
      seoWithDescriptions('Page SEO description', 'Distinct OG description'),
      buildSiteSeoFallback(site, 'https://tenant.example/store/biz', null),
      { preferSite: false, site }
    )
    expect(description(merged)).toBe('Page SEO description')
    expect(ogDescription(merged)).toBe('Distinct OG description')
  })

  it('keeps the configured fallback when the API returns nothing', () => {
    const site = { name: 'Tenant', description: 'Client description' }
    const merged = mergeSeoData(
      null,
      buildSiteSeoFallback(site, 'https://tenant.example/store/biz', null),
      { preferSite: false, site }
    )
    expect(description(merged)).toBe('Client description')
    expect(ogDescription(merged)).toBe('Client description')
  })

  it('leaves unrelated metas, links, title and image behavior unchanged', () => {
    const site = { name: 'Tenant', description: 'Client description', social_share: 'https://cdn.example/share.png' }
    const seoData = {
      title: { innerHtml: 'API Title' },
      metas: [
        { name: 'title', content: 'ignored title meta' },
        { name: 'keywords', content: 'tacos, delivery' },
        { property: 'og:type', content: 'article' },
        { name: 'description', content: 'API description' }
      ],
      links: [{ rel: 'canonical', href: 'https://tenant.example/page' }]
    }
    const merged = mergeSeoData(seoData, buildSiteSeoFallback(site, 'https://tenant.example/', null), {
      preferSite: true,
      site
    })
    expect(merged.title).toBe('Tenant')
    expect(merged.links).toEqual([{ rel: 'canonical', href: 'https://tenant.example/page' }])
    expect(merged.metas.find(m => m?.name === 'keywords')?.content).toBe('tacos, delivery')
    // preferSite keeps site-precedence for unrelated metas: fallback og:type wins
    expect(merged.metas.find(m => m?.property === 'og:type')?.content).toBe('website')
    expect(merged.metas.find(m => m?.property === 'og:title')?.content).toBe('Tenant')
    expect(merged.metas.find(m => m?.name === 'twitter:card')?.content).toBe('summary_large_image')
    expect(merged.metas.find(m => m?.property === 'og:image')?.content).toBe('https://cdn.example/share.png')
    expect(description(merged)).toBe('Client description')
  })

  it('ships no vendor description meta in the root HTML shell', () => {
    const html = readFileSync(join(process.cwd(), 'index.html'), 'utf8')
    expect(html).not.toContain('Food marketplace by ordering.inc')
    expect(html).not.toContain('name="description"')
  })
})

describe('canonical metadata normalization', () => {
  it.each([true, false])(
    'drops template alias and twitter descriptions, emits canonical tags (preferSite=%s)',
    (preferSite) => {
      const site = { name: 'Tenant', description: 'Client description' }
      const merged = mergeSeoData(
        {
          metas: [
            { name: 'description', content: 'Food marketplace by ordering.inc' },
            { name: 'og:description', content: 'a dummy description about this page' },
            { property: 'twitter:description', content: '   ' },
            { name: 'twitter:description', content: 'Food Marketplace by Ordering.co.' }
          ]
        },
        buildSiteSeoFallback(site, 'https://tenant.example/', null),
        { preferSite, site }
      )
      expect(description(merged)).toBe('Client description')
      expect(ogDescription(merged)).toBe('Client description')
      expect(merged.metas.filter(m => m?.name === 'og:description')).toHaveLength(0)
      expect(merged.metas.filter(m => m?.property === 'og:description')).toHaveLength(1)
      expect(merged.metas.some(m => m?.name === 'twitter:description' || m?.property === 'twitter:description')).toBe(false)
    }
  )

  it('canonicalizes a valid name-attr API og:description on a page route', () => {
    const site = { name: 'Tenant' }
    const merged = mergeSeoData(
      {
        metas: [
          { name: 'description', content: 'Page normal' },
          { name: 'og:description', content: 'Custom API OG' }
        ]
      },
      buildSiteSeoFallback(site, 'https://tenant.example/store/biz', null),
      { preferSite: false, site }
    )
    const ogMetas = merged.metas.filter(m => m?.name === 'og:description' || m?.property === 'og:description')
    expect(ogMetas).toHaveLength(1)
    expect(ogMetas[0]).toEqual({ property: 'og:description', content: 'Custom API OG' })
    expect(description(merged)).toBe('Page normal')
  })

  it('first valid source wins across name/property spellings in either order', () => {
    const site = { name: 'Tenant' }
    const aliasFirst = mergeSeoData(
      {
        metas: [
          { name: 'og:description', content: 'Alias OG' },
          { property: 'og:description', content: 'Canonical OG' }
        ]
      },
      buildSiteSeoFallback(site, 'https://tenant.example/store/biz', null),
      { preferSite: false, site }
    )
    expect(aliasFirst.metas.filter(m => m?.name === 'og:description' || m?.property === 'og:description')).toHaveLength(1)
    expect(ogDescription(aliasFirst)).toBe('Alias OG')

    const canonicalFirst = mergeSeoData(
      {
        metas: [
          { property: 'og:description', content: 'Canonical OG' },
          { name: 'og:description', content: 'Alias OG' }
        ]
      },
      buildSiteSeoFallback(site, 'https://tenant.example/store/biz', null),
      { preferSite: false, site }
    )
    expect(canonicalFirst.metas.filter(m => m?.name === 'og:description' || m?.property === 'og:description')).toHaveLength(1)
    expect(ogDescription(canonicalFirst)).toBe('Canonical OG')
  })

  it('an invalid alias does not claim the key and block a later valid canonical value', () => {
    const site = { name: 'Tenant' }
    const merged = mergeSeoData(
      {
        metas: [
          { name: 'og:description', content: 'Food marketplace by ordering.inc' },
          { property: 'og:description', content: 'Valid OG' }
        ]
      },
      buildSiteSeoFallback(site, 'https://tenant.example/store/biz', null),
      { preferSite: false, site }
    )
    expect(ogDescription(merged)).toBe('Valid OG')
    expect(merged.metas.filter(m => m?.name === 'og:description')).toHaveLength(0)
    expect(merged.metas.filter(m => m?.property === 'og:description')).toHaveLength(1)
  })

  it.each([true, false])(
    'normalizes og:title aliases without changing source precedence (preferSite=%s)',
    (preferSite) => {
      const site = { name: 'Tenant' }
      const merged = mergeSeoData(
        { metas: [{ name: 'og:title', content: 'API OG title' }] },
        buildSiteSeoFallback(site, 'https://tenant.example/', null),
        { preferSite, site }
      )
      const ogTitles = merged.metas.filter(m => m?.name === 'og:title' || m?.property === 'og:title')
      expect(ogTitles).toHaveLength(1)
      expect(ogTitles[0].property).toBe('og:title')
      expect(ogTitles[0].name).toBeUndefined()
      expect(ogTitles[0].content).toBe(preferSite ? 'Tenant' : 'API OG title')
    }
  )

  it('canonicalizes valid twitter descriptions to a single name tag', () => {
    const site = { name: 'Tenant' }
    const merged = mergeSeoData(
      {
        metas: [
          { property: 'twitter:description', content: 'Tweet copy' },
          { name: 'twitter:description', content: 'Second tweet copy' }
        ]
      },
      buildSiteSeoFallback(site, 'https://tenant.example/', null),
      { preferSite: false, site }
    )
    const tw = merged.metas.filter(m => m?.name === 'twitter:description' || m?.property === 'twitter:description')
    expect(tw).toHaveLength(1)
    expect(tw[0]).toEqual({ name: 'twitter:description', content: 'Tweet copy' })
  })

  it('omits template and blank twitter descriptions without fabricating a fallback', () => {
    const site = { name: 'Tenant', description: 'Client description' }
    const merged = mergeSeoData(
      {
        metas: [
          { name: 'twitter:description', content: 'a dummy description about this page' },
          { property: 'twitter:description', content: '' }
        ]
      },
      buildSiteSeoFallback(site, 'https://tenant.example/', null),
      { preferSite: false, site }
    )
    expect(merged.metas.some(m => m?.name === 'twitter:description' || m?.property === 'twitter:description')).toBe(false)
  })

  it('normalizes property=description to name and filters it the same', () => {
    const site = { name: 'Tenant', description: 'Client description' }
    const merged = mergeSeoData(
      { metas: [{ property: 'description', content: 'Food marketplace by ordering.inc' }] },
      buildSiteSeoFallback(site, 'https://tenant.example/', null),
      { preferSite: false, site }
    )
    expect(description(merged)).toBe('Client description')
    expect(merged.metas.some(m => m?.property === 'description')).toBe(false)
  })

  it('strips the opposite attribute from both-attr metas without mutating the payload', () => {
    const site = { name: 'Tenant' }
    const apiMeta = { name: 'og:description', property: 'og:description', content: 'Custom OG', extra: 'kept' }
    const merged = mergeSeoData(
      { metas: [apiMeta] },
      buildSiteSeoFallback(site, 'https://tenant.example/store/biz', null),
      { preferSite: false, site }
    )
    expect(apiMeta).toEqual({ name: 'og:description', property: 'og:description', content: 'Custom OG', extra: 'kept' })
    const emitted = merged.metas.find(m => m?.property === 'og:description')
    expect(emitted).toEqual({ property: 'og:description', content: 'Custom OG', extra: 'kept' })
  })
})

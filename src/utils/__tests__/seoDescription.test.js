import { describe, expect, it } from 'vitest'
import { DEFAULT_SEO_DESCRIPTION, resolveSeoDescription } from '../seoDescription'

describe('resolveSeoDescription', () => {
  it('returns null when nothing is provided', () => {
    expect(resolveSeoDescription()).toBeNull()
  })

  it('skips non-string values', () => {
    expect(resolveSeoDescription(undefined, null, 42, {}, [], true)).toBeNull()
  })

  it('skips blank and whitespace-only strings', () => {
    expect(resolveSeoDescription('', '   ', '\n\t ')).toBeNull()
  })

  it.each([
    'Food marketplace by ordering.inc',
    'Food marketplace by ordering.inc.',
    'FOOD MARKETPLACE BY ORDERING.INC.',
    '  food marketplace by ordering.inc.  ',
    'Food marketplace by OrderingPlus',
    'food marketplace by orderingplus',
    'Food marketplace by OrderingPlus.',
    ' FOOD MARKETPLACE BY ORDERINGPLUS. ',
    'a dummy description about this page',
    'A Dummy Description About This Page',
    'Food Marketplace by Ordering.co',
    'Food Marketplace by Ordering.co.',
    'FOOD MARKETPLACE BY ORDERING.CO.',
    '  Food Marketplace By Ordering.Co.  '
  ])('rejects template description %j', (template) => {
    expect(resolveSeoDescription(template)).toBeNull()
  })

  it('exposes the exact shared default description', () => {
    expect(DEFAULT_SEO_DESCRIPTION).toBe('Food Marketplace by Ordering.co')
    expect(resolveSeoDescription(DEFAULT_SEO_DESCRIPTION)).toBeNull()
  })

  it('rejects templates with surrounding whitespace', () => {
    expect(resolveSeoDescription('   Food marketplace by ordering.inc   ')).toBeNull()
    expect(resolveSeoDescription('  a dummy description about this page  ')).toBeNull()
  })

  it('trims a valid description', () => {
    expect(resolveSeoDescription('  Fresh groceries delivered fast  ')).toBe('Fresh groceries delivered fast')
  })

  it('returns the first valid value in order', () => {
    expect(resolveSeoDescription(null, '  ', 'First valid', 'Second valid')).toBe('First valid')
    expect(resolveSeoDescription('Food marketplace by ordering.inc', 'Second valid')).toBe('Second valid')
  })

  it('preserves customer copy that mentions the provider', () => {
    expect(resolveSeoDescription('The best tacos, powered by OrderingPlus since 2020'))
      .toBe('The best tacos, powered by OrderingPlus since 2020')
    expect(resolveSeoDescription('Food marketplace for our neighborhood'))
      .toBe('Food marketplace for our neighborhood')
    expect(resolveSeoDescription('Food marketplace by ordering.inc — now serving more!'))
      .toBe('Food marketplace by ordering.inc — now serving more!')
  })
})

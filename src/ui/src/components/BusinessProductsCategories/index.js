import React, { useEffect, useState } from 'react'
import { useTheme } from 'styled-components'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import { CategoriesContainer } from './styles'

import { BusinessProductsCategories as ProductsCategories } from '~components/components/BusinessProductsCategories'
import { Tabs, Tab } from '~ui/src/styles/Tabs'
import { useWindowSize } from '~ui/hooks/useWindowSize'
import { AutoScroll } from '~ui/src/components/AutoScroll'

const BusinessProductsCategoriesUI = (props) => {
  const {
    isSkeleton,
    categories,
    featured,
    openBusinessInformation,
    business,
    handlerClickCategory,
    categorySelected,
    useKioskApp,
    isProfessional,
    handleTogglePopover
  } = props

  const theme = useTheme()
  const windowSize = useWindowSize()
  const [selectedCategory, setSelectedCateogry] = useState({ id: null })
  const scrollTopSpan = 60
  const hideListCategory = true

  const handleChangeCategory = (category) => {
    const isBlockScroll = window.location.search.includes('category') &&
      window.location.search.includes('product')

    if (business?.lazy_load_products_recommended) {
      handlerClickCategory({ ...category })
      return
    }
    let topPos = 0
    if (!category?.id) topPos = document.getElementById('businessProductList')?.offsetTop
    else topPos = document.getElementById(`category${category.id}`)?.offsetTop
    if (!isBlockScroll) {
      window.scroll({
        top: topPos - scrollTopSpan,
        left: 0,
        behavior: 'instant'
      })
    }
  }

  const ProductCategories = () => {
    const listCategory = categories.find(category => category.id === -1)
    const otherCategories = categories.filter(category => category.id !== -1)

    return (
      <>
        {!hideListCategory && listCategory && (
          <Tab
            id={`category-menu${listCategory.id} tab`}
            className='category list category-popover-toggle'
            active={business?.lazy_load_products_recommended ? (categorySelected?.id === listCategory.id) : (selectedCategory?.id === listCategory.id)}
            onClick={() => listCategory.isList ? handleTogglePopover() : handleChangeCategory(listCategory)}
            boldText
            fromCategoryTabs
          >
            {listCategory.name}
          </Tab>
        )}
        {otherCategories && otherCategories.length && otherCategories.map((category, i) => (
          <Tab
            key={i}
            id={`category-menu${category?.id || '-all'} tab`}
            className={`category ${category.id === 'featured' ? 'special' : ''}${category.isList ? ' category-popover-toggle' : ''}`}
            active={business?.lazy_load_products_recommended ? (categorySelected?.id === category.id) : (selectedCategory?.id === category.id)}
            onClick={() => category.isList ? handleTogglePopover() : handleChangeCategory(category)}
            boldText
            fromCategoryTabs
          >
            {category.name}
          </Tab>
        ))}
      </>
    )
  }

  const handleScroll = () => {
    if (business?.lazy_load_products_recommended) return
    const featuredElement = document.getElementById('categoryfeatured')
    const _categories = featuredElement ? [...categories] : categories.filter(category => category.id !== 'featured')

    const windowTop = window.scrollY
    const categoryListsElement = document.getElementById('category-lists')
    const categoryAreaWidth = categoryListsElement?.clientWidth || 0
    const categoryScrollChange = categoryListsElement?.scrollLeft

    const tabScrollMargin = 40
    const _paddDiff = scrollTopSpan + 10

    _categories?.length && _categories.some(category => {
      const topPos = category?.id
        ? document.getElementById(`category${category.id}`)?.offsetTop
        : document.getElementById('businessProductList')?.offsetTop
      const HeightOfEle = category?.id ? document.getElementById(`category${category.id}`)?.clientHeight : 0
      if ((windowTop > topPos - _paddDiff && windowTop < topPos + HeightOfEle - _paddDiff) &&
        category?.id) {
        const choosedCategory = document.getElementById(`category-menu${category?.id || '-all'} tab`)

        if (!choosedCategory) {
          setSelectedCateogry(category)
          return true
        }
        const choosedCategoryLeft = choosedCategory?.offsetLeft || 0

        const tabWidth = choosedCategory?.offsetWidth || 0
        const tabRight = choosedCategoryLeft + tabWidth
        const visibleLeft = categoryScrollChange
        const visibleRight = categoryScrollChange + categoryAreaWidth

        const isTabFullyVisible = choosedCategoryLeft >= visibleLeft && tabRight <= visibleRight

        if (!isTabFullyVisible) {
          let moveAmount = 0

          if (choosedCategoryLeft < visibleLeft) {
            moveAmount = Math.max(0, choosedCategoryLeft - tabScrollMargin)
          } else if (tabRight > visibleRight) {
            moveAmount = choosedCategoryLeft - categoryAreaWidth + tabWidth + tabScrollMargin
          }

          categoryListsElement.scrollTo({
            top: 0,
            left: Math.max(0, moveAmount),
            behavior: 'instant'
          })
        }
        setSelectedCateogry(category)
        return true
      }
    })

    const navbar = document.getElementById('category-lists')
    const search = document.getElementById('WrapperSearchAbsolute')
    const wrapperCategories = document.getElementById('wrapper-categories')
    let limit
    if (windowSize.width >= 993) {
      limit = window.pageYOffset >= wrapperCategories?.offsetTop && window.pageYOffset > 0
    } else {
      limit = window.pageYOffset >= (wrapperCategories?.offsetTop - 56) && window.pageYOffset > 0
    }

    if (limit) {
      const classAdded = navbar.classList.contains('sticky-prod-cat')
      if (!classAdded) {
        navbar && navbar.classList.add('sticky-prod-cat')
        search && search.classList.add('sticky-search')
      }
    } else {
      navbar && navbar.classList.remove('sticky-prod-cat')
      search && search.classList.remove('sticky-search')
    }
  }

  useEffect(() => {
    const styleSheet = document.getElementById('styles')?.sheet

    if (Object.values(styleSheet.cssRules)?.length) {
      styleSheet?.deleteRule(0)
    }
    const disabledCustomWidth = !useKioskApp

    let style0 = '.sticky-prod-cat {'
    style0 += 'position: fixed !important;'
    style0 += `top: ${useKioskApp ? '0px' : '56px'} !important;`
    style0 += 'left: 0px !important;'
    style0 += 'z-index: 9999 !important;'
    style0 += 'padding: 0px 5px 0px 5px !important;'
    style0 += 'width: 100% !important;'
    !disabledCustomWidth && (style0 += `width: calc(100% - ${useKioskApp ? '50px' : '0px'}) !important;`)
    style0 += '}'

    let style1 = '.sticky-search {'
    style1 += 'position: fixed !important;'
    style1 += 'top: 0px !important;'
    style1 += 'right: 0% !important;'
    style1 += 'z-index: 9999 !important;'
    style1 += 'width: 50px !important;'
    style1 += `background-color: ${theme.colors.backgroundPage} !important;`
    style1 += '}'

    styleSheet.insertRule(style0, 0)
    styleSheet.insertRule(style1, 1)

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [useKioskApp, windowSize.width])

  useEffect(() => {
    if (business?.professionals?.length > 0 && !useKioskApp) {
      const element = document.getElementById('category-lists')
      element.setAttribute('style', 'width: 100% !important')
    }
  }, [business?.professionals, useKioskApp])

  return (
    <CategoriesContainer
      id='category-lists'
      className='category-lists'
      featured={featured}
      w={props.wContainerStyle}
      isProfessional={isProfessional}
    >
      {!isSkeleton
        ? (
          <>
            {categories.find(category => category.id === -1) && (
              <Tab
                id={'category-menu-1 tab'}
                className='category list category-popover-toggle'
                active={business?.lazy_load_products_recommended ? (categorySelected?.id === -1) : (selectedCategory?.id === -1)}
                onClick={() => handleTogglePopover()}
                boldText
              >
                {categories.find(category => category.id === -1).name}
              </Tab>
            )}
            <Tabs className='category-lists-tabs' variant='primary'>
              {openBusinessInformation
                ? <ProductCategories />
                : <AutoScroll>
                    <ProductCategories />
                  </AutoScroll>}
            </Tabs>
          </>
          )
        : <Tabs variant='primary'>
            {[...Array(4).keys()].map(i => (
              <Tab key={i} fromCategoryTabs>
                <Skeleton width={100} />
              </Tab>
            ))}
          </Tabs>}
    </CategoriesContainer>
  )
}

export const BusinessProductsCategories = (props) => {
  const businessProductsCategoriesProps = {
    ...props,
    UIComponent: BusinessProductsCategoriesUI
  }

  return (
    <ProductsCategories {...businessProductsCategoriesProps} />
  )
}

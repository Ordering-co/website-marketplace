import React, { useRef, useEffect, useCallback } from 'react'
import { useTheme } from 'styled-components'

import {
  BusinessSearch,
  DeleteContent
} from './styles'

import { useLanguage } from '~components/contexts/LanguageContext'
import { Input } from '~ui/src/styles/Inputs'

export const SearchBar = (props) => {
  const {
    onSearch,
    search,
    placeholder,
    lazyLoad,
    isCustomLayout,
    handleCustomEnter,
    forwardRef,
    starbucksStyle
  } = props
  const theme = useTheme()
  const [, t] = useLanguage()
  const el = useRef()
  const timeoutRef = useRef(null)
  const previousSearchRef = useRef(undefined)
  const onSearchRef = useRef(onSearch)
  const onSearchStartRef = useRef(props?.onSearchStart)
  const handleCustomEnterRef = useRef(handleCustomEnter)
  const lazyLoadRef = useRef(lazyLoad)

  useEffect(() => {
    onSearchRef.current = onSearch
    onSearchStartRef.current = props?.onSearchStart
    handleCustomEnterRef.current = handleCustomEnter
    lazyLoadRef.current = lazyLoad
  }, [onSearch, props?.onSearchStart, handleCustomEnter, lazyLoad])

  const onChangeSearch = useCallback((e) => {
    if (e.keyCode === 13) {
      handleCustomEnterRef.current?.(e.target.value)
      return
    }

    if (previousSearchRef.current !== e.target.value) {
      if (!lazyLoadRef.current) {
        onSearchRef.current?.(e.target.value)
        if (el.current) {
          el.current.value = e.target.value
        }
      } else {
        onSearchStartRef.current?.(e.target.value)
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          onSearchRef.current?.(e.target.value)
          if (el.current) {
            el.current.value = e.target.value
          }
        }, 750)
      }
    }
    previousSearchRef.current = e.target.value
  }, [])

  const handleClear = () => {
    onSearchRef.current?.('')
    if (el.current) {
      el.current.value = ''
    }
  }

  useEffect(() => {
    const input = el.current
    if (!input) return
    input.onkeyup = onChangeSearch
    return () => {
      input.onkeyup = null
      clearTimeout(timeoutRef.current)
    }
  }, [onChangeSearch])

  useEffect(() => {
    if (!search || search === '') {
      if (el.current) {
        el.current.value = ''
      }
    }
  }, [search])

  useEffect(() => {
    if (props.forceFocus && el.current) {
      el.current.focus()
    }
  }, [props.forceFocus])

  return (
    <BusinessSearch
      className={(!isCustomLayout && 'search-bar') + ' search-bar-business-listing'}
      isCustomLayout={isCustomLayout}
      hasValue={el.current?.value}
      starbucksStyle={starbucksStyle}
    >
      <Input
        ref={(ref) => {
          el.current = ref
          if (forwardRef) {
            forwardRef.current = ref
          }
          if (ref) {
            ref.onkeyup = onChangeSearch
          }
        }}
        name='search'
        aria-label='search'
        placeholder={placeholder}
        autoComplete='off'
        maxLength='500'
        style={el.current?.value ? {} : { backgroundImage: `url(${theme?.images?.general?.searchIcon})` }}
        defaultValue={search}
        onClick={(e) => handleCustomEnterRef.current?.(e)}
      />
      <DeleteContent className='clear'>
        {el.current?.value && <span onClick={handleClear}>{t('CLEAR', 'Clear')}</span>}
      </DeleteContent>
    </BusinessSearch>
  )
}

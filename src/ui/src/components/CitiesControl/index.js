import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { ButtonWrapper, CityItem, Container, SearchBarContainer } from './styles'
import { useLanguage } from '~components/contexts/LanguageContext'
import { useOrder } from '~components/contexts/OrderContext'
import { Button } from '~ui/src/styles/Buttons'
import { SearchBar } from '~ui/src/components/SearchBar'
import { ModalHeader, ModalIcon, ModalIconWrapper, ModalTitle } from '../Modal/styles'

import { Icon } from '~ui-icon'

export const CitiesControl = (props) => {
  const {
    cities,
    onClose,
    handleChangeCity
  } = props

  const [, t] = useLanguage()
  const [orderState] = useOrder()

  const [cityState, setCityState] = useState(orderState?.options?.city_id)
  const [cityFilter, setCityFilter] = useState('')
  const handleClick = () => {
    cityState !== orderState?.options?.city_id && handleChangeCity(cityState)
    onClose && onClose()
  }

  return (
    <>
      <Container>
        <ModalIconWrapper>
          <ModalIcon>
            {
              <Icon name="closeMd" onClick={() => onClose()} />
            }
          </ModalIcon>
        </ModalIconWrapper>
        <ModalHeader>
          <ModalTitle>
            {t('SELECT_A_STORE', 'Select a store')}
          </ModalTitle>
        </ModalHeader>
        {
          orderState?.loading
            ? (
            <Skeleton height={40} count={3} style={{ marginBottom: '10px' }} />
              )
            : (
            <>
              <SearchBarContainer>
                <SearchBar
                  name='city-filter'
                  placeholder={t('SEARCH_CITIES', 'Search Cities')}
                  onSearch={(val) => setCityFilter(val)}
                  search={cityFilter}
                />
              </SearchBarContainer>
              {cities?.filter(city => city?.name?.toLowerCase?.()?.includes(cityFilter?.toLowerCase?.()))?.map(city => city?.enabled && (
                <CityItem key={city?.id} onClick={() => setCityState(city?.id === cityState ? null : city?.id)}>
                  <span className='radio'>
                    {city?.id === cityState
                      ? <Icon name="radioChecked" className='city-checked' />
                      : <Icon name="radioOff" />}
                  </span>
                  {city?.name}
                </CityItem>
              ))}

            </>
              )
        }
      </Container>
      <ButtonWrapper>
        <Button color='primary' onClick={() => handleClick()}>
          {t('CONTINUE', 'Continue')}
        </Button>
        <Icon name="arrowRight" />
      </ButtonWrapper>
    </>
  )
}

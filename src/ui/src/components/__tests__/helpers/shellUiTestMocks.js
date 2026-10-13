import React from 'react'
import { vi } from 'vitest'

export const createControllerMock = (uiProps = {}) => ({
  Controller: ({ UIComponent, ...rest }) => <UIComponent {...uiProps} {...rest} />
})

export const mockLogoutAction = (uiProps = {}) => {
  vi.mock('~components/components/LogoutAction', () => ({
    LogoutAction: ({ UIComponent, ...rest }) => (
      <UIComponent handleLogoutClick={vi.fn()} onClose={vi.fn()} {...uiProps} {...rest} />
    )
  }))
}

export const mockLanguageSelectorController = (languagesState, extra = {}) => {
  vi.mock('~components/components/LanguageSelector', () => ({
    LanguageSelector: ({ UIComponent, ...rest }) => (
      <UIComponent
        languagesState={languagesState}
        currentLanguage='en'
        handleChangeLanguage={vi.fn()}
        {...extra}
        {...rest}
      />
    )
  }))
}

export const mockFloatingButtonController = (uiProps = {}) => {
  vi.mock('~components/components/FloatingButton', () => ({
    FloatingButton: ({ UIComponent, ...rest }) => (
      <UIComponent btnText='Checkout' btnValue='$10' handleButtonClick={vi.fn()} {...uiProps} {...rest} />
    )
  }))
}

export const mockWebsocketStatusController = (uiProps = {}) => {
  vi.mock('~components/components/WebsocketStatus', () => ({
    WebsocketStatus: ({ UIComponent, ...rest }) => (
      <UIComponent
        socketStatus={1}
        reconnectAttemptCount={0}
        connectedDate='2026-01-01'
        {...uiProps}
        {...rest}
      />
    )
  }))
}

export const mockPageBannerController = (pageBannerState) => {
  vi.mock('~components/components/PageBanner', () => ({
    PageBanner: ({ UIComponent, ...rest }) => (
      <UIComponent pageBannerState={pageBannerState} title='Banner' {...rest} />
    )
  }))
}

export const mockSmartAppBannerController = () => {
  vi.mock('~components/components/SmartAppBanner', () => ({
    SmartAppBanner: ({ UIComponent, ...rest }) => <UIComponent {...rest} />
  }))
}

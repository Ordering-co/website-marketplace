export const buildPwaPromptCopy = (t) => ({
  copyTitle: t('PWA_ADD_TO_HOME_SCREEN', 'Add to Home Screen'),
  copyBody: t(
    'PWA_ADD_TO_HOME_BODY',
    'This website has app functionality. Add it to your home screen to use it in fullscreen and while offline.'
  ),
  copyShareButtonLabel: t('PWA_SHARE_BUTTON', "1) Press the 'Share' button"),
  copyAddHomeButtonLabel: t('PWA_ADD_HOME_BUTTON', "2) Press 'Add to Home Screen'"),
  copyClosePrompt: t('PWA_CLOSE_PROMPT', 'Close')
})

export const shouldShowIosPwaPrompt = ({
  ready,
  languageLoading,
  userAgent = ''
} = {}) => {
  if (!ready || languageLoading) return false
  return !/CriOS/i.test(String(userAgent))
}

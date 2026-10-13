export const buildPwaPluginOptions = () => ({
  disable: false,
  registerType: 'autoUpdate',
  injectRegister: null,
  manifest: false,
  workbox: {
    globPatterns: ['**/*.{js,css,svg,png,jpg,jpeg,webp,woff,woff2,ico}'],
    globIgnores: ['**/index.html', '**/*.html', '**/manifest.json'],
    navigateFallback: null,
    navigateFallbackDenylist: [/.*/],
    maximumFileSizeToCacheInBytes: 15 * 1024 * 1024
  },
  // A Vite-dev SW intercepts the HMR websocket. Register only after `pnpm build`.
  devOptions: { enabled: false }
})

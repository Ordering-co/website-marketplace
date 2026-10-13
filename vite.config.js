import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'node:path'
import { readFileSync, copyFileSync } from 'node:fs'
import { buildPwaPluginOptions } from './src/utils/pwaPluginOptions.js'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))

// Opt-in HTTPS dev-tunnel mode. Set VITE_TUNNEL=true to expose the dev server
// through a quick tunnel (Cloudflare *.trycloudflare.com or VS Code *.devtunnels.ms).
// Left OFF by default so plain `localhost` HMR is never affected — hard-coding
// hmr.clientPort would otherwise break hot reload for non-tunnel dev.
const tunnelMode = process.env.VITE_TUNNEL === 'true'
const tunnelAllowedHosts = ['.devtunnels.ms', '.trycloudflare.com']

const serverConfig = {
  port: 3000,
  open: false,
  ...(tunnelMode
    ? {
        // Listen on all interfaces so the tunnel can reach the dev server
        host: true,
        // Allow the tunnel hostnames through Vite's host check
        allowedHosts: tunnelAllowedHosts,
        // Route the HMR websocket over the tunnel's HTTPS port (443)
        hmr: { clientPort: 443 }
      }
    : {})
}

const copyConfigToDist = () => ({
  name: 'copy-config-to-dist',
  writeBundle () {
    copyFileSync(
      path.resolve(__dirname, 'src/config.json'),
      path.resolve(__dirname, 'dist/config.json')
    )
  }
})

const createConfig = base => ({
  base,
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-styled-components', { displayName: true, fileName: false, pure: true }]
        ]
      }
    }),
    copyConfigToDist(),
    VitePWA(buildPwaPluginOptions())
  ],
  resolve: {
    dedupe: ['react', 'react-dom', 'scheduler'],
    alias: [
      { find: /^smart-app-banner$/, replacement: path.resolve(__dirname, 'src/shims/ordering-sab.js') },
      { find: /^ordering-sab-vendor$/, replacement: path.resolve(__dirname, 'node_modules/smart-app-banner') },
      { find: /^~components\//, replacement: path.resolve(__dirname, 'src/@/components/src') + '/' },
      { find: /^~components$/, replacement: path.resolve(__dirname, 'src/@/components/src') },
      { find: /^~ui\//, replacement: path.resolve(__dirname, 'src/ui') + '/' },
      { find: /^~ui$/, replacement: path.resolve(__dirname, 'src/ui') },
      { find: /^~ui-icon$/, replacement: path.resolve(__dirname, 'src/ui/src/components/Icon') },
      { find: /^~\//, replacement: path.resolve(__dirname, 'src') + '/' }
    ]
  },
  server: serverConfig,
  preview: {
    port: 3000,
    // `pnpm preview` + cloudflared (Android PWA / installability) hits this
    // host check even when VITE_TUNNEL is off. Preview has no HMR, so allowing
    // the tunnel suffixes here does not affect localhost hot reload.
    allowedHosts: tunnelAllowedHosts
  },
  build: {
    outDir: 'dist',
    // Cloudflare Workers assets are capped at 25 MiB per file; production
    // source maps for this bundle exceed that limit. Set GENERATE_SOURCEMAP=true
    // locally when you need maps (e.g. Sentry upload) — do not deploy them.
    sourcemap: process.env.GENERATE_SOURCEMAP === 'true',
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Stable vendor chunks: they rarely change between deploys, so
        // returning visitors keep them cached while app code churns. They
        // also download in parallel with the entry chunk.
        manualChunks (id) {
          if (!id.includes('node_modules')) return
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'vendor-react'
          if (/node_modules\/(styled-components|stylis|@emotion|shallowequal|hoist-non-react-statics)\//.test(id)) return 'vendor-styled'
          if (/node_modules\/(socket\.io-client|engine\.io-client|socket\.io-parser|@socket\.io)\//.test(id)) return 'vendor-socket'
        }
      }
    }
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
      // react-ios-pwa-prompt UMD wrapper reads Node `global` at evaluate time.
      define: {
        global: 'globalThis'
      }
    },
    include: [
      'react-hook-form',
      'react-otp-input',
      'react-select',
      'react-linkify',
      'ordering-sab-vendor',
      'react-ios-pwa-prompt',
      '@loadable/component'
    ]
  },
  define: {
    global: 'globalThis',
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.PUBLIC_URL': JSON.stringify(''),
    'process.env.npm_package_version': JSON.stringify(pkg.version)
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['src/@/components/**', 'node_modules/**'],
    css: false,
    coverage: {
      provider: 'v8',
      // PR CI only needs json (70% gate) and text (job logs). Skip html/lcov.
      reporter: ['text', 'json'],
      reportsDirectory: './coverage',
      // F1 + A1 + P1–P7 + W1 + W2⁻ + W3 + W4⁻ + W5⁻ + W6⁻ + W7⁻ + W8⁻ + W9⁻ + W10: see TEST_BATCH_REGISTRY.md
      // W2⁻ = W2 without Header/SidebarMenu until W10. W4⁻/W5⁻/W6⁻/W7⁻/W8⁻/W9⁻ = smoke-only deferred units excluded.
      include: [
        'src/config.js',
        'src/utils/**/*.{js,jsx}',
        'src/components/ConsentUserSync/**/*.{js,jsx}',
        'src/components/ForterScript/**/*.{js,jsx}',
        'src/components/HelmetTags/**/*.{js,jsx}',
        'src/components/IntercomWrapper/**/*.{js,jsx}',
        'src/components/LazyRetry/**/*.{js,jsx}',
        'src/components/ListenPageChanges/**/*.{js,jsx}',
        'src/components/ScrollToTop/**/*.{js,jsx}',
        'src/components/SentryInitializer/**/*.{js,jsx}',
        'src/components/SubdomainComponent/**/*.{js,jsx}',
        'src/components/TrackingOnlyRoutes/**/*.{js,jsx}',
        'src/pages/Home/**/*.{js,jsx}',
        'src/pages/ResetPassword/**/*.{js,jsx}',
        'src/pages/UserVerification/**/*.{js,jsx}',
        'src/pages/SessionsList/**/*.{js,jsx}',
        'src/pages/SignUpBusiness/**/*.{js,jsx}',
        'src/pages/SignUpDriver/**/*.{js,jsx}',
        'src/pages/BusinessesList/**/*.{js,jsx}',
        'src/pages/BusinessListingSearch/**/*.{js,jsx}',
        'src/pages/BusinessProductsList/**/*.{js,jsx}',
        'src/pages/Promotions/**/*.{js,jsx}',
        'src/pages/Favorite/**/*.{js,jsx}',
        'src/pages/Cms/**/*.{js,jsx}',
        'src/pages/Checkout/**/*.{js,jsx}',
        'src/pages/MultiCart/**/*.{js,jsx}',
        'src/pages/MultiCheckout/**/*.{js,jsx}',
        'src/pages/MyOrders/**/*.{js,jsx}',
        'src/pages/OrderDetails/**/*.{js,jsx}',
        'src/pages/TrackingHome/**/*.{js,jsx}',
        'src/pages/MultiOrdersDetails/**/*.{js,jsx}',
        'src/pages/MessagesList/**/*.{js,jsx}',
        'src/pages/Profile/**/*.{js,jsx}',
        'src/pages/AddressList/**/*.{js,jsx}',
        'src/pages/SavedCards/**/*.{js,jsx}',
        'src/pages/Wallets/**/*.{js,jsx}',
        'src/pages/Help/**/*.{js,jsx}',
        'src/pages/PagesList/**/*.{js,jsx}',
        'src/pages/PageNotFound/**/*.{js,jsx}',
        'src/ui/src/components/LoginForm/**/*.{js,jsx}',
        'src/ui/src/components/ForgotPasswordForm/**/*.{js,jsx}',
        'src/ui/src/components/ResetPassword/**/*.{js,jsx}',
        'src/ui/src/components/UserVerification/**/*.{js,jsx}',
        'src/ui/src/components/VerifyCodeForm/**/*.{js,jsx}',
        'src/ui/src/components/SessionsList/**/*.{js,jsx}',
        'src/ui/src/components/SignUpForm/**/*.{js,jsx}',
        'src/ui/src/components/SignUpBusiness/**/*.{js,jsx}',
        'src/ui/src/components/SignUpDriver/**/*.{js,jsx}',
        'src/ui/src/components/SignUpApproval/**/*.{js,jsx}',
        'src/ui/src/components/AppleLogin/**/*.{js,jsx}',
        'src/ui/src/components/GoogleLogin/**/*.{js,jsx}',
        'src/ui/src/components/FacebookLogin/**/*.{js,jsx}',
        'src/ui/src/components/GoogleIdentity/**/*.{js,jsx}',
        'src/ui/src/components/QueryLoginSpoonity/**/*.{js,jsx}',
        'src/ui/src/components/SmsLogin/**/*.{js,jsx}',
        'src/ui/src/components/PostLoginHomeGate/**/*.{js,jsx}',
        'src/ui/src/components/NavigationBar/**/*.{js,jsx}',
        'src/ui/src/components/Footer/**/*.{js,jsx}',
        'src/ui/src/components/HeaderOption/**/*.{js,jsx}',
        'src/ui/src/components/LogoutButton/**/*.{js,jsx}',
        'src/ui/src/components/LogoutPopup/**/*.{js,jsx}',
        'src/ui/src/components/UserPopover/**/*.{js,jsx}',
        'src/ui/src/components/LanguageSelector/**/*.{js,jsx}',
        'src/ui/src/components/LanguageSelectorList/**/*.{js,jsx}',
        'src/ui/src/components/SpinnerLoader/**/*.{js,jsx}',
        'src/ui/src/components/NotNetworkConnectivity/**/*.{js,jsx}',
        'src/ui/src/components/WebsocketStatus/**/*.{js,jsx}',
        'src/ui/src/components/CookieConsentBanner/**/*.{js,jsx}',
        'src/ui/src/components/Modal/**/*.{js,jsx}',
        'src/ui/src/components/Confirm/**/*.{js,jsx}',
        'src/ui/src/components/Dropdown/**/*.{js,jsx}',
        'src/ui/src/components/Icon/**/*.{js,jsx}',
        'src/ui/src/components/Image/**/*.{js,jsx}',
        'src/ui/src/components/LinkableText/**/*.{js,jsx}',
        'src/ui/src/components/Pagination/**/*.{js,jsx}',
        'src/ui/src/components/SearchBar/**/*.{js,jsx}',
        'src/ui/src/components/FloatingButton/**/*.{js,jsx}',
        'src/ui/src/components/SmartAppBanner/**/*.{js,jsx}',
        'src/ui/src/components/PageBanner/**/*.{js,jsx}',
        'src/ui/src/components/PageNotFound/**/*.{js,jsx}',
        'src/ui/src/components/NotFoundSource/**/*.{js,jsx}',
        'src/ui/src/components/AutoScroll/**/*.{js,jsx}',
        'src/ui/src/components/HomeHero/**/*.{js,jsx}',
        'src/ui/src/components/BusinessesListing/**/*.{js,jsx}',
        'src/ui/src/components/BusinessesListing/layouts/AppointmentsBusinessListing/**/*.{js,jsx}',
        'src/ui/src/components/BusinessesListing/layouts/OriginalBusinessesListing/**/*.{js,jsx}',
        'src/ui/src/components/BusinessesListing/layouts/OriginalBusinessesListing/OrdersSection/**/*.{js,jsx}',
        'src/ui/src/components/BusinessListingSearch/**/*.{js,jsx}',
        'src/ui/src/components/BusinessListingSearch/Accordion/**/*.{js,jsx}',
        'src/ui/src/components/BusinessListingSearch/MaxSectionItem/**/*.{js,jsx}',
        'src/ui/src/components/BusinessTypeFilter/**/*.{js,jsx}',
        'src/ui/src/components/BusinessTypes/**/*.{js,jsx}',
        'src/ui/src/components/HighestRated/**/*.{js,jsx}',
        'src/ui/src/components/BusinessesMap/**/*.{js,jsx}',
        'src/ui/src/components/Locations/**/*.{js,jsx}',
        'src/ui/src/components/CitiesControl/**/*.{js,jsx}',
        'src/ui/src/components/Promotions/**/*.{js,jsx}',
        'src/ui/src/components/Favorite/**/*.{js,jsx}',
        'src/ui/src/components/FavoriteList/**/*.{js,jsx}',
        'src/ui/src/components/Cms/**/*.{js,jsx}',
        'src/ui/src/components/Help/**/*.{js,jsx}',
        'src/ui/src/components/HelpStaticPage/**/*.{js,jsx}',
        'src/ui/src/components/ProfessionalBusinessFilter/**/*.{js,jsx}',
        'src/ui/src/components/ProfessionalFilter/**/*.{js,jsx}',
        'src/ui/src/components/SingleProfessionalCard/**/*.{js,jsx}',
        'src/ui/src/components/ProfessionalInfo/**/*.{js,jsx}',
        'src/ui/src/components/ProfessionalProfile/**/*.{js,jsx}',
        'src/ui/src/components/SearchProducts/**/*.{js,jsx}',
        'src/ui/src/components/BusinessMenuList/**/*.{js,jsx}',
        'src/ui/src/components/BusinessProductsList/SubcategoriesComponent/**/*.{js,jsx}',
        'src/ui/src/components/CategoriesPopover/**/*.{js,jsx}',
        'src/ui/src/components/ProductIngredient/**/*.{js,jsx}',
        'src/ui/src/components/ProductOption/**/*.{js,jsx}',
        'src/ui/src/components/ProductShare/**/*.{js,jsx}',
        'src/ui/src/components/ScheduleAccordion/**/*.{js,jsx}',
        'src/ui/src/components/PreorderDateTimeSteps/**/*.{js,jsx}',
        'src/ui/src/components/GoogleGpsButton/**/*.{js,jsx}',
        'src/ui/src/components/AccordionDropdown/**/*.{js,jsx}',
        'src/ui/src/components/CartSidebar/**/*.{js,jsx}',
        'src/ui/src/components/CartStoresListing/**/*.{js,jsx}',
        'src/ui/src/components/CartStudentAlert/**/*.{js,jsx}',
        'src/ui/src/components/OrderTypeSelectorHeader/**/*.{js,jsx}',
        'src/ui/src/components/OrderTypeSelectorContent/**/*.{js,jsx}',
        'src/ui/src/components/AddressForm/AddressMapBoxList/**/*.{js,jsx}',
        'src/ui/src/components/AddressDetails/**/*.{js,jsx}',
        'src/ui/src/components/MultiCart/**/*.{js,jsx}',
        'src/ui/src/components/PaymentOptionCash/**/*.{js,jsx}',
        'src/ui/src/components/PaymentOptionEpayco/**/*.{js,jsx}',
        'src/ui/src/components/StripeRedirectForm/**/*.{js,jsx}',
        'src/ui/src/components/OrderSuccessModal/**/*.{js,jsx}',
        'src/ui/src/components/CancellationComponent/**/*.{js,jsx}',
        'src/ui/src/components/HorizontalOrdersLayout/**/*.{js,jsx}',
        'src/ui/src/components/OrderProgress/**/*.{js,jsx}',
        'src/ui/src/components/OrderItAgain/**/*.{js,jsx}',
        'src/ui/src/components/LastOrders/**/*.{js,jsx}',
        'src/ui/src/components/OrdersOption/PreviousBusinessOrdered/**/*.{js,jsx}',
        'src/ui/src/components/OrdersOption/PreviousProfessionalOrdered/**/*.{js,jsx}',
        'src/ui/src/components/ReviewTrigger/**/*.{js,jsx}',
        'src/ui/src/components/UserProfileForm/ProfileOptions/**/*.{js,jsx}',
        'src/ui/src/components/WalletTransactionItem/**/*.{js,jsx}',
        'src/ui/src/components/RewardsBanner/**/*.{js,jsx}',
        'src/ui/src/components/CustomOrderBanner/**/*.{js,jsx}',
        'src/ui/src/components/PagesList/**/*.{js,jsx}',
        'src/ui/src/components/DatePicker/**/*.{js,jsx}',
        'src/ui/src/components/WeekCalendarPicker/**/*.{js,jsx}',
        'src/ui/src/components/GiftCard/GiftCardOrdersList/**/*.{js,jsx}',
        'src/ui/src/components/GiftCard/RedeemGiftCard/**/*.{js,jsx}',
        'src/ui/src/components/GiftCard/SingleGiftCard/**/*.{js,jsx}',
        'src/ui/src/components/GiftCard/HorizontalGiftCardOrdersLayout/**/*.{js,jsx}',
        'src/ui/src/components/GiftCard/VerticalGiftCardOrdersLayout/**/*.{js,jsx}',
        'src/ui/src/components/StudentsList/**/*.{js,jsx}',
        'src/ui/src/components/OrderStudentInfo/**/*.{js,jsx}',
        'src/ui/src/components/Header/**/*.{js,jsx}',
        'src/ui/src/components/TrackingHome/**/*.{js,jsx}',
        'src/ui/src/components/OrderDetails/layouts/Tracking/**/*.{js,jsx}',
        'src/ui/src/components/SidebarMenu/**/*.{js,jsx}',
        'src/contexts/CheckoutFieldsContext/**/*.{js,jsx}',
        'src/pages/CompleteProfile/**/*.{js,jsx}',
        'src/ui/src/components/CompleteProfile/**/*.{js,jsx}'
      ],
      exclude: [
        'node_modules/',
        'dist/',
        'worker/**',
        'src/@/components/**',
        '**/*.config.{js,ts}',
        '**/setupTests.js',
        '**/*.{test,spec}.{js,jsx,ts,tsx}',
        '**/__tests__/**',
        '**/__mocks__/**',
        '**/coverage/**',
        '**/styles.js',
        '**/Header/utils.js',
        '**/BusinessController/utils.js',
        '**/BusinessReviews/utils.js',
        '**/ProductShare/ProductCopyURL.js',
        '**/BusinessBasicInformation/BusinessInfoComponent.js',
        '**/BusinessBasicInformation/SocialNetWork.js',
        '**/BusinessBasicInformation/SearchComponent.js'
      ]
    }
  }
})

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const assetBaseUrl =
    process.env.ASSET_BASE_URL ||
    process.env.VITE_ASSET_BASE_URL ||
    env.ASSET_BASE_URL ||
    env.VITE_ASSET_BASE_URL ||
    '/'

  return createConfig(
    assetBaseUrl.endsWith('/') ? assetBaseUrl : `${assetBaseUrl}/`
  )
})

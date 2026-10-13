# Tracking-only mode

Turns any white-label site of this marketplace into an order-tracking page only, driven by a setting of the site theme. Customers open the link they receive (WhatsApp, SMS, email) and follow their order; there is no menu, cart, login, store pages or footer navigation.

## How it is activated

The switch is a setting of the **site theme**, saved with the rest of the website builder values (`values.tracking_settings.tracking_only = true`).

1. Dashboard → My Products → Ordering Website 2 → **Advanced Settings** → section **Order tracking** → check **Tracking-only site** → Save.
   It is stored through the usual `POST /v400/{lang}/{project}/sites/{site_id}/themes/{theme_id}` call.
2. The value travels inside the site theme that the Cloudflare worker already injects as `window.__FIRST_LOAD__.theme`, so it is known before the first paint without any extra config.
3. The app resolves the flag with `resolveTrackingOnly(themeUpdated)` (`src/utils/trackingOnlyMode.js`), reading `tracking_settings.tracking_only` from the merged site theme.

Every site has its own theme, so other sites of the same project keep the setting off and behave as a normal marketplace. A client that wants a full website **and** a tracking URL needs two sites; a client that only wants tracking turns the setting on in its existing site.

## What changes in the app

| Area | Tracking-only behaviour |
|------|-------------------------|
| Routes (`src/components/TrackingOnlyRoutes`) | `/` and `/home` render the landing; `/orders/:orderId?hash=…` renders the order; everything else redirects to `/`. An order link without hash (and without session) goes to the landing. |
| Header | Logo only, linking to `/`. No sidebar, address, search, login, signup, cart or language selector. |
| Shell (`src/App.js`) | No footer (unless the powered-by branding must show), no mobile navigation bar, no smart app banner, no PWA prompt, no profile-completion gate. |
| Landing (`src/pages/TrackingHome`, `src/ui/src/components/TrackingHome`) | "Follow your order" and "open the link we sent you"; the site logo already sits in the header. |
| Order page (`src/ui/src/components/OrderDetails/layouts/Tracking`) | Tracking layout: status text, four-icon progress bar (store → driver → home → delivered) filled by thirds, "Estimated delivery HH:mm – HH:mm" window (order time + `eta_time`, +10 min) or "Delivered at", static store map before pickup, full-width live driver map with fullscreen toggle, two tabs while the delivery is in flight (Delivery: address, customer, driver with call button; Your order: totals breakdown, products, payment method), and the satisfaction survey once delivered (intro → stars for the order and thumbs for the delivery with reason chips → thanks). Non-delivery orders keep simple customer and driver cards. |

Theme flags still respected: `confirmation.components.order.components.progress.hidden`, `confirmation.components.business.components.map.hidden`, `confirmation.components.driver.components.{name,photo,phone}.hidden`, `confirmation.components.customer.components.address.hidden`, `orders.components.review_order_button.hidden`.

Map markers (`getTrackingMarkerIcons`): driver, store and customer icons default to the app assets; the store marker uses the business logo when the order has one. The site theme can override them under `my_products.components.images.components.{tracking_driver_icon,tracking_store_icon,tracking_customer_icon}.components.image`. The survey image (`getTrackingSurveyImage`) defaults to the business logo and can be overridden with `tracking_survey_image`.

The survey posts the order review to `POST /business/{business_id}/reviews` (stars, `quality_tags`, comment) and the driver review to `POST /users/{driver_id}/user_reviews` (thumb up = 5, down = 1, `tags`, comment) with the guest hash header (`surveyRequests.js`). Once `order.review` exists only the thank-you text shows.

## Courier projects

Some clients use the tracking page for deliveries they run on behalf of another brand (for example, a courier service delivering orders for a restaurant). In those orders the delivery fee is what the courier pays the driver, the products carry price 0 and the real order detail lives in the comments, so the costs make no sense to the end customer.

Projects listed in `COURIER_TRACKING_PROJECTS` (`src/utils/trackingOnlyMode.js`, matched with `includes` against `ordering.project`) change the "Your order" tab:

- Shows the Ordering order number (`#order.id`) at the top.
- Hides the whole cost breakdown (products, fees, taxes, delivery fee, total) and the payment method.
- Lists every product, including price 0 ones, without prices; each product keeps its comment (the brand's order code).
- Shows the order comment (`order.comment`) under the products.

To enable it for another client, add its project name to the list. Other tracking-only sites are not affected.

## Checklist when activating a client

- Advanced setting **Tracking-only site** enabled in the theme of the tracking site only.
- Branding (logo, favicon, colors, fonts) configured in the site theme; the landing and header use the site logo.
- `google_maps_api_key` set for the project (or overridden for the site) and the key's HTTP referrer restrictions include the tracking domain (temporal `*.my-sites.app` and the custom domain).
- Link validity: `guest_uuid_access = 1` and `guest_uuid_max_days` (default 3) on the project decide how long the `?hash=` link opens the order. After that the page shows "Sorry, the order has expired."
- Chat is not available for guests; the tracking page only offers the driver phone. The shared controller still requests the chat messages without a session (a 401 it ignores), same as the classic order page.
- The survey uses the same hash; once `order.review` exists it is not asked again.

## Tests

- Unit: `src/utils/__tests__/trackingOnlyMode.test.js`, `src/components/TrackingOnlyRoutes/__tests__`, `src/pages/TrackingHome/__tests__`, `src/ui/src/components/TrackingHome/__tests__`, `src/ui/src/components/OrderDetails/layouts/Tracking/__tests__` (layout, tabs, survey, survey requests), Header tracking-only case.
- Browser checks on your own test project: verify tracking-only routes, guest-link expiry, theme visibility flags, maps, courier order details and the delivered-order survey.

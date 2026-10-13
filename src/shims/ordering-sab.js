/**
 * Re-export so Vite does not emit the literal "smart-app-banner.js"
 * filename, which aggressive block lists such as Brave Shields may block.
 */
export { default } from 'ordering-sab-vendor'

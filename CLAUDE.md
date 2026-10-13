# Development guide

Use Node 24 and pnpm 9.15.0. Initialize the shared-components submodule before installing or building. Commands and configuration are documented in README.md and setup.md.

Keep controller logic in the shared-components repository and presentation in src/ui. Deep-import local and shared components; lazy-load heavy interaction components. The application uses React Router v5. Use theme tokens for styling, real translation fallbacks and retain existing locales. Do not edit the shared submodule from this repository.

Run lint:check, build, i18n:verify, i18n:check-generated and test:coverage after relevant changes. Coverage configuration is scoped and must not be treated as whole-application verification. Keep environment credentials out of browser code and source control.

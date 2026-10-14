# Verificación actual del onboarding Marketplace — SERGIO-139

Fecha: 2026-10-14. Coordinación SERGIO-137. Base pública: `b9d61d06e6336307d9a1db13df4cd2b5ce824f33`; rama `codex/sergio-137-product-onboarding`.

Se aplicó el patch público revisado del piloto, SHA256 `4988c7ef563569e3560342b2ed02235200203192fe321f750d0f9306339dcc06`. Es antecedente de implementación; la evidencia siguiente corresponde a esta corrida actual. Correcciones posteriores solo documentales: clone seguro, checkout existente preservado, capacidad del navegador pendiente y alternativa explícita de ID público sin afirmar pertenencia. Los scripts/provenance permanecen fijados; el runbook prohíbe iniciar login legacy que crea claves.

## Comandos y resultados actuales

Runtime: Node `v24.21.0`, `corepack pnpm` `9.15.0`; sin cambiar defaults globales.

| Comando/comprobación | Resultado | Evidencia |
| --- | --- | --- |
| `HUSKY=0 corepack pnpm install --frozen-lockfile` | ✅ exit 0 | 872 paquetes; resolución omitida; lockfile comparado después |
| `corepack pnpm marketplace:test` | ✅ exit 0, 18/18 | Repetición con personalizaciones, mismatch, reconnect/restore, puerto ocupado, detección MCP, exporter y pairing con fixtures |
| `corepack pnpm lint:check` | ✅ exit 0 | Sin errores de lint |
| `corepack pnpm i18n:verify` | ✅ exit 0 | 1336 claves, catálogo completo |
| `corepack pnpm i18n:check-generated` | ✅ exit 0 | Catálogo coincide con escaneo |
| `corepack pnpm build` | ✅ exit 0 | Bundle/PWA generados; 213 entradas precache |
| `corepack pnpm test:coverage` | ✅ exit 0; 268 archivos, 758 tests | 177.69 s; statements/lines 82.73%, branches 67.46%, functions 60.02%; alcance configurado |
| `node scripts/coverage-summary.js --no-run --strict` | ✅ exit 0, gate 73.24% ≥ 70% | Fórmula CI: statements/lines 82.74%, branches 67.46%, functions 60.02%; alcance configurado |
| `corepack pnpm marketplace:connection` | ✅ exit 0 | connected, orderingv1, existing-launcher; solo status/project/source |
| `corepack pnpm marketplace:configure --public-project orderingv1` | ✅ exit 0 | Config local reversible; primera escritura, backup absent; solo GET públicos |
| `corepack pnpm marketplace:doctor` | ✅ exit 0 | Proyecto/configuración/catálogo público válidos; 1 comercio en la consulta mínima |
| GET `https://docs.ordering.co/connect/connect.js` con Node fetch | ✅ HTTP 200 | `marketplace-project-selection-v1=false`; sin pairing/login |
| `git diff --check` | ✅ exit 0 | Sin errores de espacios |
| `dist/config.json` comparado con `src/config.json` | ✅ bytes iguales | Config local de desarrollo excluida del build |

La consulta inicial de capacidad con urllib devolvió HTTP 403; Node fetch respondió HTTP 200 y capacidad ausente. El 403 no se interpretó como prueba de despliegue o ausencia. Logs locales: `/tmp/sergio-139-onboarding-tests.log`, `/tmp/sergio-139-lint-check.log`, `/tmp/sergio-139-i18n-verify.log`, `/tmp/sergio-139-i18n-check-generated.log`, `/tmp/sergio-139-build.log`, `/tmp/sergio-139-test-coverage.log`. No se incorporan respuestas de clientes ni credenciales al repo.

## Preservación comprobada

Comparación contra HEAD: `src/config.json`, `pnpm-lock.yaml`, `LICENSE`, `LICENSE-ORDERING` y `.gitmodules` conservan exactamente sus bytes. Gitlink SDK intacto: `3d0d34b42fb2dacfe640baaa8234eb9f4d2a0f72`. Config y backups locales ignorados. Sin edición de shared-components.

| Archivo | SHA256 vigente |
| --- | --- |
| src/config.json | `310d665b756181065a9abb07594b13e7fee2fe70879d2652a4109f06942cbf09` |
| pnpm-lock.yaml | `67ab9ca4e295dc54456447814929930a03b81bd839c6a3d43bc2f6409ad22c7a` |
| LICENSE | `6b9d4e92753c86e7601f5ad6d749e610fcae955556b0c3abffda8ebccd64ad6c` |
| LICENSE-ORDERING | `d63c18b0698dd0267a7dd03f737340b73b384840a0e3f5c5952afe9506b66111` |
| .gitmodules | `c942d0a29d7e03b386dde69347762a3687820179b659a15cbe5de7dce2e0c839` |

## Disponibilidad y límites

La selección por navegador no está disponible en la página consultada. [Docs #70](https://github.com/Finitless-com/ordering-docs/pull/70) es evidencia privada preparada, no un requisito cliente ni prueba de despliegue. [Quickstart #7](https://github.com/Ordering-co/ordering-dev-quickstart/pull/7) tampoco se presupone publicado. El helper/exporter fijado permite reutilizar la conexión existente o validar un proyecto público sin instalar esas ramas.

Se detectó orderingv1 por el launcher ya preparado y se validó la configuración pública. El GET aislado no demuestra pertenencia. Sin login nuevo, registro/revocación MCP, datos cliente, pedidos/pagos, despliegue ni infraestructura.

La sesión principal coordina navegador, primera edición y HMR; no se reutilizan capturas viejas para afirmar validación actual. Build exitoso no prueba apariencia, catálogo renderizado, checkout, pagos, notificaciones ni websocket en vivo.

El subagente no hizo stage, commit, push, branch ni merge. Git y PR los consolida la sesión principal.


## Coordinated browser verification — 2026-10-14

Private HTTP preview returned 200. The Codex in-app browser rendered `/store/fastbite` with the selected `orderingv1` project indicator and catalog/menu headings. A temporary presentation edit changed `Local Marketplace preview` to `My first Marketplace edit`; the browser updated without a manual reload and Vite recorded an HMR update for the exact component. Browser error log was empty. The edit was restored byte-for-byte. Screenshots: [before](onboarding-evidence/marketplace-before.png) and [after](onboarding-evidence/marketplace-after.png). This proves the public read-only storefront path; consumer sign-in, checkout, payments, new project-only pairing and laptop access are not measured here.

## Corrección del aislamiento de sesión — 2026-10-14

Se reprodujo el defecto con fixtures locales: pin `selected`, marcador local `selected`, proyecto guardado `foreign` y token de consumidor. La versión anterior daba precedencia al marcador local y aceptaba la sesión; la nueva prueba falló antes del cambio (1 fallo, 5 aprobadas).

La corrección examina ambos identificadores presentes y rechaza un token si cualquiera difiere del proyecto fijado, o si no hay identificador conocido. El rechazo ocurre antes de escribir el marcador local; tokens, proyectos y cachés quedan intactos. El SDK no se modificó.

Después: `corepack pnpm test src/utils/localMarketplaceSession.test.js` exit 0, 6/6. Cubre marcador desactualizado y caso inverso, marcadores compatibles, consumidor anónimo y sesión desconocida/foránea. Las pruebas comparan todo el almacenamiento en los rechazos. `corepack pnpm lint:check`, `corepack pnpm build` y `git diff --check` pasan. Se corrigió un espacio doble detectado por el primer lint y se repitió exitosamente.

Logs actuales: `/tmp/sergio-139-session-before.log`, `/tmp/sergio-139-session-after.log`, `/tmp/sergio-139-session-lint-check.log`, `/tmp/sergio-139-session-build.log`. La cobertura completa anterior describe el hito previo; no se recalculó para esta corrección focalizada. No se probaron tokens reales ni se borró almacenamiento de personas.

## Corrección de cachés de consumidor sin token — 2026-10-14

El SDK fijado hidrata `user-customer` en CustomerContext (línea 13) y OrderContext (línea 113), `options`/dirección en OrderContext (líneas 200–224), `user` y `device_code` en SessionContext (líneas 52–53) y `school_selected_students` en useSelectedStudent (líneas 3/11). Esa identidad/dirección también pertenece a un tenant aunque no exista token. No se editó el SDK.

Prueba previa con datos sintéticos: los 10 casos foreign/unknown para esas cinco claves eran aceptados indebidamente (10 fallos, 12 pruebas aprobadas). El guard ahora considera las claves leídas reales junto con token: si alguna existe y cualquiera de los dos marcadores contradice el tenant fijado, o ambos faltan, rechaza antes de escribir.

Después de la corrección: `corepack pnpm test src/utils/localMarketplaceSession.test.js` exit 0, **22/22**. Incluye foreign/unknown por cada clave real, mismos cachés del tenant seleccionado, conflictos de marcadores, sesión limpia y preferencias globales. Los rechazos comparan todas las entradas y preservan valores crudos, tokens, cachés y un carrito fixture. Una sesión anónima sin caché SDK puede fijarse; no se borran idioma, moneda, país ni carritos.

`corepack pnpm lint:check`, `corepack pnpm build` y `git diff --check` pasan en esta corrección. Logs: `/tmp/sergio-139-cache-before.log`, `/tmp/sergio-139-cache-after.log`, `/tmp/sergio-139-cache-lint-check.log`, `/tmp/sergio-139-cache-build.log`. Las cifras completas de coverage anteriores corresponden al hito anterior. La verificación de caché utiliza fixtures aislados, no tokens, direcciones ni usuarios reales; no hubo escrituras live.

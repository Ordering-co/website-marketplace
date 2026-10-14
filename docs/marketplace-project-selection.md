# Datos que necesita el Website

| Dato | Origen | Necesita credencial privada |
|---|---|---|
| Proyecto | MCP ya conectado/launcher existente o selección Dashboard/Accounts | Solo para identificar la elección; el dato final es público |
| API URL, v400, app_id | Contrato fijado del repositorio | No |
| Idioma | Helper ORDERING_LANG, en por defecto | No |
| Socket | SDK fijado (sockets-v3.orderingplus.com) | No para invitado |
| Config/theme/tipo/ubicación de prueba | GET públicos del proyecto | No |
| Comercios/catálogo público | API de consumidor | No |
| Cuenta del consumidor | Login normal del Website cuando el cliente lo usa | Su propia sesión, separada del desarrollador |

No se requiere una MCP key ni una API key administrativa para renderizar/arrancar el Website. El MCP existente evita repetir login y permite ofrecer el proyecto correcto. Si no se reutiliza, el pairing nuevo valida identidad/pertenencia en el navegador y entrega solo el proyecto; no crea claves. Los datos ya disponibles nunca se piden de nuevo.

## Disponibilidad y alternativa explícita

La selección por navegador depende de que la página pública anuncie `marketplace-project-selection-v1`; la publicación de la página de selección está pendiente y una rama abierta no demuestra despliegue. El helper fijado comprueba esa capacidad antes de crear el pairing. Quickstart #7 también está pendiente; el exporter incluido aquí permite las lecturas públicas sin instalar esa rama.

Si no hay MCP reutilizable ni capacidad publicada, ofrece la alternativa manual de un identificador público confirmado por la persona. `marketplace:configure --public-project` valida proyecto/configuración/catálogo con GET públicos y conserva `verification.identity=false`. Esa validación no prueba autenticación ni pertenencia. Nunca elijas el primer proyecto ni generes claves como alternativa.

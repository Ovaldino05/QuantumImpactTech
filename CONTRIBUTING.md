# Contribuir / Contributing

¡Gracias por tu interés! / Thanks for your interest!

1. Abre un issue antes de cambios grandes. / Open an issue before large changes.
2. Haz fork, crea una rama y envía un pull request pequeño y enfocado. / Fork, branch, send a small focused PR.
3. Incluye pruebas para todo cambio de código. / Include tests for any code change.
4. Mensajes de commit claros en imperativo. / Clear imperative commit messages.
5. Si usaste IA para generar parte del cambio, indícalo en la descripción del PR y asegúrate de entender cada línea. / If AI helped, say so in the PR and make sure you understand every line.

Issues con la etiqueta `good first issue` están pensados para personas nuevas.
Todos los participantes deben respetar el [Código de Conducta](CODE_OF_CONDUCT.md).

## schema-caniuse: corregir o agregar datos / fixing compatibility data

1. Edita `packages/schema-caniuse/data/targets.json`.
2. Cita la documentación **oficial** del proveedor en `sources` y actualiza `verified` (AAAA-MM-DD).
3. Si un dato no está documentado, usa `unknown`. No adivines.
4. Agrega o ajusta una prueba en `packages/schema-caniuse/test/`.
5. `cd packages/schema-caniuse && npm test`

# schema-caniuse

**¿Puedo usar este JSON Schema con OpenAI, Claude o Gemini?**

[English](README.md)

Cada proveedor de LLM acepta un *subconjunto distinto* de JSON Schema para salidas estructuradas y llamadas a herramientas. El modo estricto de OpenAI rechaza `allOf`. Gemini ignora `minLength` sin avisar. El SDK de Claude elimina `maximum` antes de enviar. Hoy cada framework de agentes mantiene su propia lista escrita a mano, y esas listas se desactualizan.

`schema-caniuse` es una **base de datos de compatibilidad compartida, con fuentes y versionada**, más un verificador sin dependencias: la idea de [caniuse](https://caniuse.com) para navegadores, aplicada a esquemas de LLM.

- Cada dato cita la documentación oficial del proveedor y una fecha de verificación.
- Lo no documentado se reporta como **unknown**; nunca se adivina.
- Señala la ubicación exacta de cada problema con un JSON Pointer.
- Funciona con esquemas y con listas de herramientas (MCP `inputSchema`, OpenAI `parameters`, Anthropic `input_schema`), incluidos límites por solicitud como los 24 parámetros opcionales de Claude.

## Instalación

```sh
npm install schema-caniuse
```

## Uso

```sh
npx schema-caniuse esquema.json
npx schema-caniuse herramientas.json --target anthropic-strict
```

```js
import { check, support } from 'schema-caniuse';

support('gemini', 'minLength'); // 'ignored'
check(miEsquema, 'openai-strict').issues;
```

Código de salida `1` si algún destino tiene errores: úsalo en CI.

## Contribuir

La contribución más valiosa es corregir datos: edita `data/targets.json`, cita la fuente oficial, actualiza `verified` y agrega una prueba.

## Licencia

MIT

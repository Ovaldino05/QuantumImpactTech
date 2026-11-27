# Matriz de cumplimiento

Última actualización: 2026-11-26 (2.ª revisión). Solo se marca **Cumplido** con evidencia pública.

| Requisito | Indicador objetivo | Valor actual | % | Fuente de verificación | Riesgo principal | Próximo paso |
|---|---|---|---|---|---|---|
| A. Autor de bibliotecas | ≥500 repos dependientes **o** ≥100 paquetes dependientes **o** ≥200.000 descargas/mes | 0 / 0 / 0 | 0% | deps.dev, npmjs.com/package/schema-caniuse | Adopción depende de que frameworks de agentes la usen como dependencia | Publicar `schema-caniuse` 0.1.0 en npm |
| B. Colaborador principal reconocido | Rol oficial en proyecto de relevancia internacional | Ninguno | 0% | Archivos MAINTAINERS / páginas de gobernanza | Requiere años de contribución sostenida | Primera revisión en python-stdnum#348 |
| C. Colaborador activo | ≥100 PRs fusionados en repos ajenos en 12 meses (meta interna 150) | 0 | 0% | `is:pr is:merged author:Ovaldino05 -user:Ovaldino05` | Volumen sin calidad se percibe como spam; políticas de IA | 1 PR propio y defendible |
| D. Creador de comunidad | ≥20 colaboradores externos con PR fusionado en un repo en 12 meses (meta 50) | 0 | 0% | Página Contributors del repo | Depende de adopción real | Issues `good first issue` en `schema-caniuse` (creados) |
| E. Infraestructura crítica | OpenSSF Criticality Score ≥0,4 | No calculado | 0% | `criticality_score` (ossf) | El score pondera antigüedad, contribuidores, organizaciones y dependientes: no se acelera | Calcular línea base al mes 3 |
| Seguridad | OpenSSF Scorecard ejecutándose | Configurado (pendiente de primera ejecución) | — | Pestaña Actions / Security | — | Fusionar esta rama |

## Notas de metodología
- **Criticality Score** ≠ **Scorecard**. El primero mide importancia (media ponderada de señales con umbrales, algoritmo de Rob Pike); el segundo mide prácticas de seguridad.
- Objetivo vs. estimación vs. resultado: esta tabla solo registra **resultados**.

## Estrategia por requisito
- **A/E:** un paquete de *datos* compartido (modelo caniuse-lite / browserslist) acumula dependientes porque otros paquetes lo importan en vez de mantener su propia lista. Ese es el camino legítimo a dependientes y criticidad.
- **D:** cada cambio de un proveedor es un PR pequeño y verificable (dato + fuente + prueba): ideal para colaboradores nuevos.
- **B/C:** contribuir correcciones de compatibilidad de esquemas a frameworks que hoy mantienen listas propias (Mastra, LangChain, etc.), siempre con revisión y declaración de uso de IA cuando la política lo pida.

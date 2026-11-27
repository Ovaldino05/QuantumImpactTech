# Hoja de ruta / Roadmap

Las fechas son horizontes de trabajo, no garantías de adopción.

## 24 horas
- [x] Auditoría de la cuenta (2 repos públicos, sin código funcional).
- [x] Políticas base: CONTRIBUTING, SECURITY, CODE_OF_CONDUCT.
- [x] OpenSSF Scorecard + Dependabot en este repo.
- [x] Matriz de cumplimiento con valores reales.
- [ ] Crear repo `Ovaldino05/Ovaldino05` y publicar el README de perfil (`perfil/README.md`). *(requiere acción del dueño)*
- [x] Proyecto insignia global `schema-caniuse` 0.1.0: datos con fuentes, verificador, CLI, 16 pruebas, CI (Node 18/20/22).
- [x] Workflow de publicación en npm con OIDC (sin tokens).
- [x] Identidad visual (logos, banners animados SVG, tarjetas) generada en el repo.
- [x] Sitio web con playground, panel de impacto en vivo, hoja de ruta y blog (`site/`).
- [x] Plantilla de perfil con estadísticas propias (sin servicios de terceros), snake y gráfico 3D.
- [ ] Activar GitHub Pages. *(requiere acción del dueño)*
- [ ] Primera publicación en npm. *(requiere cuenta npm del dueño)*

## 7 días
- [ ] `schema-caniuse`: verificación en vivo contra las APIs (Gemini tiene nivel gratuito) y matriz pública en GitHub Pages.
- [ ] Agregar destinos: Mistral, AWS Bedrock, Ollama/vLLM.
- [ ] Descargar y estudiar la Ficha Técnica vigente de la DGI; resumirla en `sfep-pa/docs/ficha-tecnica.md`.
- [ ] Implementar dígito verificador (DV) del RUC con pruebas contra el validador oficial de la DGI.
- [ ] Revisar como panameño el PR abierto de RUC en `python-stdnum` (arthurdejong/python-stdnum#348) y aportar datos de formato reales.
- [ ] Crear cuentas en PyPI y npm con 2FA.

## 30 días
- [ ] `schema-caniuse` para Python (PyPI) leyendo el mismo `targets.json`.
- [ ] Función `fix()` que transforme el esquema para cada proveedor.
- [ ] `sfep-pa` v0.1.0 en PyPI con publicación confiable (OIDC): modelos de datos, generación de XML, validación contra XSD, CUFE.
- [ ] Documentación bilingüe + ejemplos.
- [ ] 10 issues `good first issue` reales.
- [ ] Primeros 3 PRs externos fusionados (documentación, pruebas, traducciones).

## 90 días
- [ ] Paquete npm equivalente (TypeScript).
- [ ] Integraciones de ejemplo (Django, FastAPI, Express).
- [ ] Presentar el proyecto en comunidades de Panamá y Centroamérica (FIEC-UP, Python Panamá, meetups).
- [ ] 15 PRs externos fusionados acumulados.

## 180 días
- [ ] v1.0 estable, política de mantenimiento publicada.
- [ ] OpenSSF Best Practices badge (nivel passing).
- [ ] 5+ colaboradores externos con PR fusionado.

## 365 días
- [ ] Revisar metas de la matriz con datos reales y redefinir objetivos.

# Vault Archive

Un HUD web interactivo inspirado en el Pip-Boy de Fallout. Proyecto personal de portfolio técnico y visual, creado desde cero sin assets extraídos del juego original.

**[Demo en vivo →](https://mariomunpeq.github.io/Vault-Archive/)**

---

## Características

- Encendido / apagado con animación de boot (secuencia de 8 sprites)
- Efecto CRT: scanlines, viñeta y parpadeo sutil
- Navegación por pestañas: STAT, ITEMS, DATA, MAP, RADIO
- Pestaña STAT con sub-vistas: STATUS, SPECIAL, PERKS
- Barra de estado global (HP, NIVEL, AP)
- Efectos de sonido en interacciones (encendido, cambio de módulo, etc.)

## Roadmap

- Contenido interactivo en ITEMS, DATA, MAP y RADIO
- Mini-juego integrado
- Tema de color alternativo (ámbar / New Vegas)

## Stack

- [Vite](https://vite.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- CSS puro (sin frameworks de estilos)

## Desarrollo local

```bash
git clone https://github.com/MarioMunPeq/Vault-Archive.git
cd Vault-Archive
npm install
npm run dev
```

Comandos disponibles:

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (`tsc -b && vite build`) |
| `npm run lint` | Linting con ESLint |
| `npm run preview` | Vista previa del build |

## Créditos y licencias de assets de terceros

### Fuente tipográfica

- **Monofonto** — [dafont.com](https://www.dafont.com/monofonto.font) — Licencia de uso comercial libre.

### Efecto CRT

- Efecto CRT en CSS basado en [Torodem/crt-css](https://github.com/Torodem/crt-css). Reimplementado en CSS puro.

### Efectos de sonido

Archivos en `src/assets/sfx/` bajo licencia **CC0** (dominio público), obtenidos de Freesound y OpenGameArt:

| Archivo | Fuente |
|---|---|
| `computer-beep.wav` | Freesound / OpenGameArt (CC0) |
| `crt-on.wav` | Freesound / OpenGameArt (CC0) |
| `dial_move.ogg` | Freesound / OpenGameArt (CC0) |
| `electric-hum.wav` | Freesound / OpenGameArt (CC0) |
| `geiger-counter.wav` | Freesound / OpenGameArt (CC0) |
| `mechanical-click.wav` | Freesound / OpenGameArt (CC0) |
| `module_change.ogg` | Freesound / OpenGameArt (CC0) |
| `submodule_change.ogg` | Freesound / OpenGameArt (CC0) |
| `toggle-switch.mp3` | Freesound / OpenGameArt (CC0) |
| `UI_PipBoy_BootSequence_C.ogg` | Freesound / OpenGameArt (CC0) |
| `UI_Pipboy_OK.ogg` | Freesound / OpenGameArt (CC0) |

### Imágenes

Las imágenes en `src/assets/images/` (boot, head, body, special) son **recreación propia** generada por el autor, no extraídas del juego original.

### Aviso legal

Fallout y Pip-Boy son marcas registradas y copyright de **ZeniMax Media / Bethesda Softworks**. Este proyecto no tiene afiliación, patrocinio ni ánimo de lucro por parte de dichas empresas.

## Licencia

El código fuente propio de este repositorio se distribuye bajo la licencia **MIT** (ver [LICENSE](LICENSE)).

La licencia MIT cubre únicamente el código. Los assets de terceros mencionados arriba mantienen sus licencias originales.

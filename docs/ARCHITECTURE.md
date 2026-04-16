# Architecture

Compressroar is a single-page app (SPA) built with vanilla JavaScript and [WebC](https://www.11ty.dev/docs/languages/webc/) custom elements. [Eleventy](https://www.11ty.dev/) generates the static files at build time; all image compression runs entirely in the browser at runtime.

## Directory structure

```
src/
  _components/     # WebC custom elements (drop-zone, image-queue, etc.)
  _includes/       # Eleventy layouts
  css/             # CSS source — main.css is the entry point
  js/
    _components/   # JS-only custom elements (image-card, filepicker-toggle, spinner)
    _utils.js      # Shared utility functions (bytesToSize, debounce)
    main.js        # JS entry point — imports and exposes globals
    worker.js      # Dedicated Web Worker for PNG compression
  index.webc       # Page template and app orchestrator
  manifest.webc    # Web app manifest

config/
  esbuild.js       # Eleventy plugin: bundles JS via esbuild
  lightningcss.js  # Eleventy plugin: bundles CSS via LightningCSS
  process-bundle.js # Transforms applied to WebC inline script/style bundles
```

## Build pipeline

Eleventy builds `src/` → `dist/`. Three processing layers run in parallel:

1. **WebC plugin** — compiles `.webc` component files. Each component's `<style>` and `<script webc:bucket="defer">` blocks are extracted and concatenated into page-level CSS/JS bundles. `config/process-bundle.js` minifies these bundles using LightningCSS (CSS) and esbuild (JS).

2. **esbuild plugin** (`config/esbuild.js`) — processes top-level `.js` files in `src/js/`. Files and directories prefixed with `_` are skipped. This produces two output bundles:
   - `dist/js/main.js` — the main app bundle (imports from `_components/` and npm packages)
   - `dist/js/worker.js` — the PNG compression Web Worker (separate entry point)

3. **LightningCSS plugin** (`config/lightningcss.js`) — processes top-level `.css` files in `src/css/`. Skips `_`-prefixed files/dirs, so only `main.css` is compiled; all partials are pulled in via `@import`.

## Components

All UI elements are [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) (custom elements). WebC components live in `src/_components/`; JS-only components live in `src/js/_components/`.

| Component | File | Responsibility |
|---|---|---|
| `<drop-zone>` | `_components/drop-zone.webc` | Handles drag-and-drop and delegates file input; emits `filedrop` |
| `<filepicker-toggle>` | `js/_components/filepicker-toggle.js` | Renders a button that opens a hidden `<input type="file">` and routes its `change` event to `<drop-zone>` |
| `<image-queue>` | `_components/image-queue.webc` | Sidebar list managing the queue of image cards; handles add, clear, and download |
| `<image-card>` | `js/_components/image-card.js` | One card per image; owns loading, compression, and selection state |
| `<image-preview>` | `_components/image-preview.webc` | Full-size preview panel for the selected image; supports slider and tap-to-reveal modes |
| `<quality-slider>` | `_components/quality-slider.webc` | Range input (0–1) for compression quality; emits `qualitychange` |
| `<preview-toggle>` | `_components/preview-toggle.webc` | Radio group to switch preview mode; emits `previewtoggle` |

## Custom events

Components communicate through bubbling DOM events. `index.webc` contains the inline `<script>` that wires everything together by listening at the document level.

| Event | Fired by | Payload (`event.detail`) | Handled by |
|---|---|---|---|
| `filedrop` | `<drop-zone>` | `{ files: FileList }` | `index.webc` → `imageQueue.add()` |
| `cardselect` | `<image-card>` | _(none)_ | `<image-queue>` (updates `activecard`), `index.webc` (updates preview sources) |
| `imagecompress` | `<image-card>` | `{ original, compressed }` (URLs) | `index.webc` (auto-selects first card; re-updates preview on quality change) |
| `queueclear` | `<image-queue>` | _(none)_ | `index.webc` → clears `image-preview.sources` |
| `qualitychange` | `<quality-slider>` | _(none, read `event.target.value`)_ | `index.webc` → sets `card.quality` on the active card |
| `previewtoggle` | `<preview-toggle>` | _(none, read `event.target.value`)_ | `index.webc` → sets `imagePreview.mode` |

## Data flow: adding and compressing images

```
User drops/picks files
        │
        ▼
<drop-zone> emits "filedrop"
        │
        ▼
index.webc listener → imageQueue.add(files)
        │
        ▼
<image-queue> creates one <image-card> per file,
appends to the list, auto-selects the first card
        │
        ▼
<image-card>.render()
  ├─ reads File as DataURL via FileReader
  └─ when image loads → compressImage()
        │
        ├─── PNG ──────────────────────────────────────────────┐
        │    Spawn Worker (worker.js)                          │
        │    postMessage({ file: Uint8Array, options })        │
        │    Worker runs pngquant → postMessage(result)        │
        │    card receives Uint8Array → creates Blob + URL     │
        │                                                      │
        └─── JPEG / WebP ──────────────────────────────────────┘
             OffscreenCanvas.convertToBlob({ quality })
             → creates Blob + Object URL
        │
        ▼
<image-card> stores { blob, url } in this.data.compressed,
updates size display, emits "imagecompress"
        │
        ▼
index.webc auto-clicks the first card's select button
→ "cardselect" fires → imagePreview.sources updated
```

## Data flow: selecting a card and changing quality

```
User clicks an <image-card>
        │
        ▼
"cardselect" event bubbles
        │
        ├─ <image-queue> sets this.activecard (tracks index)
        └─ index.webc sets imagePreview.sources = [original, compressed]
                                    also sets qualitySlider.value = card.quality
        │
        ▼
<image-preview> renders <image-compare> slider
  (or two stacked images for tap-to-reveal mode)

User moves <quality-slider>
        │
        ▼
"qualitychange" fires (debounced 500 ms)
        │
        ▼
index.webc sets card.quality = slider.value
        │
        ▼
<image-card> observes "quality" attribute change → compressImage()
        │
        ▼
"imagecompress" fires → index.webc re-clicks card button
→ imagePreview.sources updated with new compressed URL
```

## Download

| Scenario | Mechanism |
|---|---|
| Single image | Create a temporary `<a>` with `href = compressed.url` and trigger `.click()` |
| Multiple images | Collect all `compressed.blob` values into a JSZip archive, generate it as a Blob, then trigger download via FileSaver.js (`saveAs`) |

## Web Worker (PNG compression)

`src/js/worker.js` is a dedicated worker loaded at runtime from `/js/worker.js`. It imports `pngquant.min.js` from a jsDelivr CDN URL via `importScripts`. The quality range passed to pngquant is derived from the slider value: `[quality - 15, quality + 15]` (clamped to 0–100).

**Note:** The CDN dependency means PNG compression requires an internet connection even though everything else is fully offline.

## Key dependencies

| Package | Purpose |
|---|---|
| `@11ty/eleventy` | Static site generator / build orchestrator |
| `@11ty/eleventy-plugin-webc` | WebC component support in Eleventy |
| `esbuild` | JS bundling and minification |
| `lightningcss` | CSS bundling and minification |
| `@cloudfour/image-compare` | `<image-compare>` slider web component used inside `<image-preview>` |
| `jszip` | Zip archive generation for multi-image download |
| `file-saver` | Cross-browser `saveAs` for triggering file downloads |
| `pngquant.min.js` (CDN) | WASM/JS port of pngquant used inside the Web Worker |

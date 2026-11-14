import {copyFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
copyFileSync(fileURLToPath(new URL('./maplibre-gl-worker.mjs',import.meta.resolve('maplibre-gl'))),'public/maplibre-gl-worker.mjs');

// Publica el próximo Short pendiente de scripts/shorts.json por la API (público al terminar).
// Lo corre un LaunchAgent dos veces por día. Registro en shorts/publicados.json: { id: videoId }.
// Uso: node scripts/cola.mjs [--dry]
import { readFileSync, writeFileSync, existsSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

process.chdir(new URL('..', import.meta.url).pathname);
const SITE = 'https://altitude-films-co.osuna-devs.workers.dev';
const REG = 'shorts/publicados.json';
const hechos = existsSync(REG) ? JSON.parse(readFileSync(REG, 'utf8')) : {};
const cola = JSON.parse(readFileSync('scripts/shorts.json', 'utf8'));
const s = cola.find((x) => !hechos[x.id] && existsSync(`shorts/${x.id}.mp4`));
if (!s) { console.log('cola vacía'); process.exit(0); }

const meta = {
  title: `${s.title} #shorts`.slice(0, 100),
  description: `${s.title} · ${s.place}${s.place.includes('Hawaiʻi') ? '' : ', Hawaiʻi'}\n\nAerial film & photography by Altitude Films. Now booking in Maui (until Nov 4), then California.\nBook a shoot → ${SITE}\n\n${['hawaii', 'drone', ...s.tags, 'shorts'].map((t) => '#' + t).join(' ')}`,
  tags: ['hawaii', 'drone', 'aerial', ...s.tags],
};
if (process.argv.includes('--dry')) { console.log(s.id, meta); process.exit(0); }

const archivo = join(mkdtempSync(join(tmpdir(), 'alt-')), 'meta.json');
writeFileSync(archivo, JSON.stringify(meta));
const videoId = execFileSync('node', ['scripts/youtube.mjs', 'subir', `shorts/${s.id}.mp4`, archivo]).toString().trim().split('\n').pop();
hechos[s.id] = videoId;
writeFileSync(REG, JSON.stringify(hechos, null, 2));
console.log(`${s.id} → https://youtube.com/shorts/${videoId}`);

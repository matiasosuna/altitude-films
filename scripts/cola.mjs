// Publica el próximo Short pendiente de scripts/shorts.json por la API (público al terminar).
// Lo corre un LaunchAgent dos veces por día. Registro en shorts/publicados.json: { id: videoId }.
// Uso: node scripts/cola.mjs [--dry]
import { readFileSync, writeFileSync, existsSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname, basename } from 'node:path';

process.chdir(new URL('..', import.meta.url).pathname);
const SITE = 'https://altitude-films-co.osuna-devs.workers.dev';
const REG = 'cola/publicados.json';
const hechos = existsSync(REG) ? JSON.parse(readFileSync(REG, 'utf8')) : {};
// Primero los videos horizontales (toma completa), después los Shorts cuadrados.
const cola = [
  ...JSON.parse(readFileSync('scripts/videos.json', 'utf8')).map((v) => ({ ...v, archivo: `videos/${v.id}.mp4`, largo: true, tags: [...(v.place === 'Oʻahu' ? ['oahu', 'honolulu'] : ['bigisland', 'kona', 'lava']), 'aerial', '4k'] })),
  ...JSON.parse(readFileSync('scripts/shorts.json', 'utf8')).map((x) => ({ ...x, archivo: `shorts/${x.id}.mp4` })),
];
// Si una subida quedó privada (se cortó antes de publicarla), primero se publica esa.
const pendiente = Object.entries(hechos).find(([, v]) => v.startsWith('privado:'));
if (pendiente) {
  const id = pendiente[1].slice(8);
  execFileSync('node', ['scripts/youtube.mjs', 'publicar', id], { stdio: 'inherit' });
  hechos[pendiente[0]] = id;
  writeFileSync(REG, JSON.stringify(hechos, null, 2));
  console.log(`${pendiente[0]} publicado (estaba privado)`);
  process.exit(0);
}
const s = cola.find((x) => !hechos[x.id]);
if (!s) { console.log('cola vacía'); process.exit(0); }
// En GitHub Actions los videos están en el release "media" del repo.
if (!existsSync(s.archivo) && process.env.CI) execFileSync('gh', ['release', 'download', 'media', '-p', basename(s.archivo), '-D', dirname(s.archivo), '--clobber'], { stdio: 'inherit' });
if (!existsSync(s.archivo)) { console.error(`falta ${s.archivo}`); process.exit(1); }

const meta = {
  title: (s.largo ? s.title : `${s.title} #shorts`).slice(0, 100),
  description: `${s.title} · ${s.place}${s.place.includes('Hawaiʻi') ? '' : ', Hawaiʻi'}\n\nAerial film & photography by Altitude Films. Now booking in Maui (until Nov 4), then California.\nBook a shoot → ${SITE}\n\n${['hawaii', 'drone', ...s.tags, ...(s.largo ? ['dronefootage'] : ['shorts'])].map((t) => '#' + t).join(' ')}`,
  tags: ['hawaii', 'drone', 'aerial', ...s.tags],
};
if (process.argv.includes('--dry')) { console.log(s.id, meta); process.exit(0); }

const archivo = join(mkdtempSync(join(tmpdir(), 'alt-')), 'meta.json');
writeFileSync(archivo, JSON.stringify(meta));
let videoId;
try {
  videoId = execFileSync('node', ['scripts/youtube.mjs', 'subir', s.archivo, archivo]).toString().trim().split('\n').pop();
} catch (e) {
  const subido = String(e.stdout || '').match(/SUBIDO (\S+)/);
  if (subido) { hechos[s.id] = `privado:${subido[1]}`; writeFileSync(REG, JSON.stringify(hechos, null, 2)); }
  throw e;
}
hechos[s.id] = videoId;
writeFileSync(REG, JSON.stringify(hechos, null, 2));
console.log(`${s.id} → https://youtu.be/${videoId}`);

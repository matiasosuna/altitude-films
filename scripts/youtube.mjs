// YouTube Data API para el canal de Altitude Films (sin dependencias).
// Uso:
//   node scripts/youtube.mjs auth                    → consentimiento una vez (elegir el canal Altitude Films), guarda .yt-token.json
//   node scripts/youtube.mjs canal                   → muestra el canal conectado
//   node scripts/youtube.mjs subir <video.mp4> <meta.json>  → sube público; meta = { title, description, tags[] }
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createServer } from 'node:http';

const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').filter((l) => l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
const CLIENT = { id: env.YT_CLIENT_ID, secret: env.YT_CLIENT_SECRET };
const TOKEN = '.yt-token.json';
const SCOPE = 'https://www.googleapis.com/auth/youtube.force-ssl';
const API = 'https://www.googleapis.com/youtube/v3';

async function tokenNuevo(body) {
  const r = await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ client_id: CLIENT.id, client_secret: CLIENT.secret, ...body }) });
  const j = await r.json();
  if (!r.ok) throw new Error(`token: ${JSON.stringify(j)}`);
  return j;
}

async function autorizar() {
  const puerto = 8767, redirect = `http://127.0.0.1:${puerto}`;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({ client_id: CLIENT.id, redirect_uri: redirect, response_type: 'code', scope: SCOPE, access_type: 'offline', prompt: 'consent select_account' })}`;
  const code = await new Promise((ok) => {
    const srv = createServer((req, res) => {
      const c = new URL(req.url, redirect).searchParams.get('code');
      res.end(c ? 'Listo, ya podes cerrar esta pestana.' : 'Falta el codigo.');
      if (c) { srv.close(); ok(c); }
    }).listen(puerto, '127.0.0.1');
    console.log(`URL ${url}`);
  });
  const t = await tokenNuevo({ code, grant_type: 'authorization_code', redirect_uri: redirect });
  writeFileSync(TOKEN, JSON.stringify({ ...t, vence: Date.now() + t.expires_in * 1000 }), { mode: 0o600 });
  console.log('token guardado');
}

async function acceso() {
  if (!existsSync(TOKEN)) throw new Error('Primero: node scripts/youtube.mjs auth');
  const t = JSON.parse(readFileSync(TOKEN, 'utf8'));
  if (t.vence > Date.now() + 60_000) return t.access_token;
  const n = await tokenNuevo({ refresh_token: t.refresh_token, grant_type: 'refresh_token' });
  writeFileSync(TOKEN, JSON.stringify({ ...t, ...n, vence: Date.now() + n.expires_in * 1000 }), { mode: 0o600 });
  return n.access_token;
}

async function api(ruta, opciones = {}) {
  const r = await fetch(`${API}${ruta}`, { ...opciones, headers: { authorization: `Bearer ${await acceso()}`, 'content-type': 'application/json', ...(opciones.headers || {}) } });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) { const e = new Error(`${r.status} ${JSON.stringify(j.error?.errors?.[0] || j)}`); e.status = r.status; throw e; }
  return j;
}

// Sube como privado y lo pasa a público al terminar: si el PUT se corta no queda un video vacío público.
async function subir(archivo, metaArchivo) {
  const meta = JSON.parse(readFileSync(metaArchivo, 'utf8'));
  const tam = statSync(archivo).size;
  const cuerpo = { snippet: { title: meta.title, description: meta.description, tags: meta.tags || [], categoryId: '19' }, status: { privacyStatus: 'private', selfDeclaredMadeForKids: false } };
  const r = await fetch('https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status', {
    method: 'POST', headers: { authorization: `Bearer ${await acceso()}`, 'content-type': 'application/json; charset=UTF-8', 'x-upload-content-type': 'video/mp4', 'x-upload-content-length': String(tam) }, body: JSON.stringify(cuerpo),
  });
  if (!r.ok) throw new Error(`inicio subida: ${r.status} ${await r.text()}`);
  const destino = r.headers.get('location');
  const salida = execFileSync('curl', ['-sS', '-X', 'PUT', '-H', `authorization: Bearer ${await acceso()}`, '-H', 'content-type: video/mp4', '--data-binary', `@${archivo}`, destino], { maxBuffer: 1 << 26 }).toString();
  const v = JSON.parse(salida);
  if (!v.id) throw new Error(`subida: ${salida.slice(0, 300)}`);
  await api('/videos?part=status', { method: 'PUT', body: JSON.stringify({ id: v.id, status: { privacyStatus: 'public', selfDeclaredMadeForKids: false } }) });
  console.log(v.id);
  return v.id;
}

const [cmd, ...args] = process.argv.slice(2);
if (cmd === 'auth') await autorizar();
else if (cmd === 'canal') { const j = await api('/channels?part=snippet&mine=true'); console.log(j.items?.map((c) => `${c.id} ${c.snippet.title} ${c.snippet.customUrl}`).join('\n')); }
else if (cmd === 'subir') await subir(args[0], args[1]);
else console.log('comandos: auth | canal | subir <video.mp4> <meta.json>');

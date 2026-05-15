// Verifies that the server lesson catalog and the frontend display data
// agree on the set of lesson ids (and per-lesson problem ids).
//
// Run via `node backend/scripts/check-catalog-sync.mjs` — exits non-zero on
// any mismatch so it can be wired into CI / npm scripts.

import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");

const serverPath = path.join(ROOT, "backend", "src", "lesson-catalog.js");
const frontPath  = path.join(ROOT, "frontend", "src", "lesson-data.js");

const { CATALOG }  = await import(`file://${serverPath.replaceAll("\\", "/")}`);
const { LESSONS }  = await import(`file://${frontPath.replaceAll("\\", "/")}`);

const errors = [];

const serverIds = new Set(Object.keys(CATALOG));
const frontIds  = new Set(Object.keys(LESSONS));

for (const id of serverIds) {
  if (!frontIds.has(id)) errors.push(`lesson ${id}: in server catalog but missing from frontend lesson-data.js`);
}
for (const id of frontIds) {
  if (!serverIds.has(id)) errors.push(`lesson ${id}: in frontend lesson-data.js but missing from server catalog`);
}

for (const id of serverIds) {
  if (!frontIds.has(id)) continue;
  const sv = CATALOG[id];
  const fr = LESSONS[id];
  if (sv.trail !== fr.trail) errors.push(`lesson ${id}: trail mismatch (server=${sv.trail}, frontend=${fr.trail})`);
  if (sv.ch !== fr.ch)       errors.push(`lesson ${id}: ch mismatch (server=${sv.ch}, frontend=${fr.ch})`);
  if (sv.no !== fr.no)       errors.push(`lesson ${id}: no mismatch (server=${sv.no}, frontend=${fr.no})`);
  // Problem ids
  const sPids = new Set(Object.keys(sv.problems ?? {}));
  const fPids = new Set([
    ...(fr.problems?.basic    ?? []).map((p) => p.id),
    ...(fr.problems?.practice ?? []).map((p) => p.id),
  ]);
  for (const p of sPids) {
    if (!fPids.has(p)) errors.push(`lesson ${id}: problem ${p} in server catalog but missing from frontend`);
  }
  for (const p of fPids) {
    if (!sPids.has(p)) errors.push(`lesson ${id}: problem ${p} in frontend but missing from server catalog`);
  }
}

if (errors.length) {
  console.error("[catalog-sync] FAIL:");
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(`[catalog-sync] OK — ${serverIds.size} lessons in sync`);

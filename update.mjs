// Holt die Live-Elo-Liste der Frauen von 2700chess.com und schreibt die Top 5 nach data.json.
// Laeuft automatisch alle 4 Stunden ueber GitHub Actions (siehe .github/workflows/update.yml).
import { writeFileSync } from "node:fs";

const URL = "https://2700chess.com/women";
const OUT = new globalThis.URL("../data.json", import.meta.url);

function stripTags(s) {
  return s.replace(/<[^>]*>/g, " ")
          .replace(/&nbsp;/g, " ")
          .replace(/&amp;/g, "&")
          .replace(/&#39;|&apos;/g, "'")
          .replace(/\s+/g, " ")
          .trim();
}

function nameFromSlug(slug) {
  return slug.split(/[-_]/).filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

export function parsePlayers(html) {
  const rows = html.split(/<tr[\s>]/i);
  const seen = new Set();
  const players = [];

  for (const row of rows) {
    const linkRe = /href="[^"]*\/players\/([^"\/?#]+)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
    let m, slug = null, name = "";
    while ((m = linkRe.exec(row)) !== null) {
      if (!slug) slug = m[1];
      const txt = stripTags(m[2]);
      if (txt.length > 1 && /[A-Za-z]/.test(txt)) { slug = m[1]; name = txt; break; }
    }
    if (!slug || seen.has(slug)) continue;

    const r = stripTags(row).match(/\b(2[3-8]\d{2}(?:\.\d)?)\b/);
    if (!r) continue;

    seen.add(slug);
    players.push({ name: name || nameFromSlug(slug), rating: parseFloat(r[1]) });
  }

  players.sort((a, b) => b.rating - a.rating);
  return players.slice(0, 5);
}

async function main() {
  const res = await fetch(URL, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Mobile Safari/537.36",
      "Accept-Language": "de,en;q=0.8"
    }
  });
  if (!res.ok) throw new Error("HTTP " + res.status);
  const players = parsePlayers(await res.text());

  if (players.length < 5) {
    console.error("Zu wenige Eintraege gefunden, data.json bleibt unveraendert.");
    process.exit(1);
  }

  const data = { players, updated: new Date().toISOString(), source: URL };
  writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n");
  console.log("Aktualisiert:", players.map(p => `${p.name} ${p.rating}`).join(", "));
}

if (!process.env.NO_MAIN) {
  main().catch(e => { console.error(e); process.exit(1); });
}

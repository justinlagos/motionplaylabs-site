// Turns the exported homepage (out/index.html) into one self-contained HTML file:
// the real markup and CSS, the shared film engine bundled inline, fonts from Google Fonts.
// Run `npm run export:preview` first. Usage: node scripts/build-film-preview.mjs <output.html>
import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const out = process.argv[2] ?? "preview.html";
const html = readFileSync("out/index.html", "utf8");

const pick = (re, label) => {
  const m = html.match(re);
  if (!m) throw new Error(`could not find ${label} in out/index.html`);
  return m[0];
};
let chrome = pick(/<a class="skip-link"[\s\S]*?<\/header>/, "header");
let film = pick(/<div class="film">[\s\S]*?<div id="after-film" tabindex="-1"><\/div><\/div>/, "film");
let footer = pick(/<footer class="footer">[\s\S]*?<\/footer>/, "footer");

// Other pages are not part of this preview: keep links visible but inert.
const inert = (s) => s.replace(/href="\/[^"#]*"/g, 'href="#top" data-preview-link=""');
chrome = inert(chrome);
film = inert(film);
footer = inert(footer);

const js = await build({
  entryPoints: ["src/preview/entry.ts"],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  write: false,
  alias: { "@": path.resolve("src") },
  logLevel: "error",
});

const css = readFileSync("src/app/globals.css", "utf8");

const page = `<title>MotionPlay Labs Website</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400..600&family=Marcellus&display=swap">
<style>
${css}
:root { --font-ui: "Instrument Sans", "Helvetica Neue", Arial, sans-serif; }
.preview-note { position: relative; z-index: 3; background: var(--ink); color: var(--graphite); font-size: 13px; text-align: center; padding: 0 var(--gutter) 28px; margin: 0; }
</style>
<div id="top"></div>
${chrome}
<main id="content" tabindex="-1">${film}</main>
${footer}
<p class="preview-note">Preview of the homepage film with placeholder footage. Links to other pages work once the site is deployed.</p>
<script>${js.outputFiles[0].text}</script>
`;
writeFileSync(out, page);
console.log(`wrote ${out} (${(page.length / 1024).toFixed(0)} KB)`);

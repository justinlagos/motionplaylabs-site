// Turns the static export (out/) into a self-contained multi-page preview that works from any
// folder: relative links, one shared stylesheet and script, fonts and footage alongside.
// React does not run in the preview; src/preview/entry.ts wires the same behaviour in plain DOM.
// Run `npm run export:preview` first. Usage: node scripts/build-site-preview.mjs <output-dir>
import { build } from "esbuild";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const outDir = process.argv[2] ?? "preview-site";
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

// Every exported page
const pages = [];
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    if (statSync(p).isDirectory()) {
      if (f === "_next" || f === "media" || f.startsWith("_") || f === "404") continue;
      walk(p);
    } else if (f === "index.html") pages.push(path.relative("out", p));
  }
};
walk("out");

// Shared script and style
const js = await build({
  entryPoints: ["src/preview/entry.ts"],
  bundle: true,
  minify: true,
  format: "iife",
  target: "es2020",
  write: false,
  alias: { "@": path.resolve("src") },
  define: { "process.env.NEXT_PUBLIC_MEDIA_ROOT": "window.__MEDIA_ROOT__" },
  logLevel: "error",
});
writeFileSync(path.join(outDir, "preview.js"), js.outputFiles[0].text);

const fontDir = "node_modules/@fontsource-variable/mona-sans/files";
const fontFile = "mona-sans-latin-standard-normal.woff2";
mkdirSync(path.join(outDir, "fonts"), { recursive: true });
cpSync(path.join(fontDir, fontFile), path.join(outDir, "fonts", fontFile));
const fontFace = `@font-face{font-family:"Mona Sans Variable";font-style:normal;font-display:swap;font-weight:200 900;font-stretch:75% 125%;src:url(fonts/${fontFile}) format("woff2-variations");}`;
writeFileSync(path.join(outDir, "site.css"), fontFace + "\n" + readFileSync("src/app/globals.css", "utf8"));

if (existsSync("public/media")) cpSync("public/media", path.join(outDir, "media"), { recursive: true });
cpSync("public/icon.svg", path.join(outDir, "icon.svg"));

const rel = (fromDir, target) => {
  const r = path.posix.relative(fromDir || ".", target);
  return r === "" ? "./" : r;
};

for (const page of pages) {
  const html = readFileSync(path.join("out", page), "utf8");
  const dir = path.posix.dirname(page.split(path.sep).join("/"));
  const here = dir === "." ? "" : dir;
  const up = here ? here.split("/").map(() => "..").join("/") + "/" : "";

  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
  // The home page keeps the preview's published name; other pages keep their own titles.
  const title = here === "" ? "MotionPlay Labs Website" : (html.match(/<title>([\s\S]*?)<\/title>/) ?? [, "MotionPlay Labs"])[1];
  const htmlTone = (html.match(/<html[^>]*data-tone="(\w+)"/) ?? [, "light"])[1];

  let content = body
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<link[^>]*>/g, "")
    .replace(/<!--\$!?-->|<!--\/\$-->/g, "");

  // Internal links become relative paths to index.html files; media and icons become relative.
  content = content.replace(/(href)="\/([^"#?]*)(#[^"]*)?"/g, (_, attr, p, hash = "") => {
    if (p.startsWith("media/") || p.endsWith(".svg")) return `${attr}="${up}${p}${hash}"`;
    const target = p.replace(/\/$/, "");
    return `${attr}="${rel(here, target ? `${target}/index.html` : "index.html")}${hash}"`;
  });
  content = content.replace(/(src|srcSet|srcset|poster)="\/(media\/[^"]*)"/g, (_, a, p) => `${a}="${up}${p}"`);

  const head = `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title><link rel="icon" href="${up}icon.svg"><link rel="stylesheet" href="${up}site.css"><script>window.__MEDIA_ROOT__=${JSON.stringify(up + "media")};document.documentElement.dataset.tone=${JSON.stringify(htmlTone)};</script>`;
  const tail = `<script src="${up}preview.js" defer></script>`;
  const doc =
    here === ""
      ? `${head}\n${content}\n${tail}\n` // the artifact page itself is wrapped in a document by the host
      : `<!doctype html><html lang="en-GB" data-tone="${htmlTone}"><head>${head}</head><body>${content}${tail}</body></html>\n`;
  mkdirSync(path.join(outDir, here), { recursive: true });
  writeFileSync(path.join(outDir, here, "index.html"), doc);
}
console.log(`wrote ${pages.length} pages to ${outDir}`);

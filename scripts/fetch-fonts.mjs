// Downloads the Satoshi variable font from Fontshare into public/fonts/.
//
// Why a script instead of committing the files: the ITF Free Font License allows
// self-hosting Satoshi on your own website, but forbids redistributing the font
// files through public repositories. So the files are fetched at build time,
// served by this site only, and git-ignored.
//
// If the download fails the build still succeeds: the CSS falls back to the
// system sans-serif stack.
import { mkdir, writeFile, access } from "node:fs/promises";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "fonts");
const CSS_API = "https://api.fontshare.com/v2/css?f[]=satoshi@1,2&display=swap";
const TARGETS = [
  { style: "normal", file: "satoshi-variable.woff2" },
  { style: "italic", file: "satoshi-variable-italic.woff2" },
];

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  if ((await Promise.all(TARGETS.map((t) => exists(join(OUT, t.file))))).every(Boolean)) {
    console.log("fonts: Satoshi already present");
    return;
  }
  const css = await (await fetch(CSS_API)).text();
  const blocks = css.split("@font-face").slice(1);
  for (const target of TARGETS) {
    const block = blocks.find((b) => b.includes(`font-style: ${target.style}`));
    const url = block?.match(/url\('([^']+\.woff2)'\)/)?.[1];
    if (!url) throw new Error(`no woff2 URL for Satoshi ${target.style}`);
    const res = await fetch(url.startsWith("//") ? `https:${url}` : url);
    if (!res.ok) throw new Error(`download failed (${res.status}) for ${url}`);
    await writeFile(join(OUT, target.file), Buffer.from(await res.arrayBuffer()));
    console.log(`fonts: saved ${target.file}`);
  }
}

main().catch((err) => {
  console.warn(`fonts: could not fetch Satoshi (${err.message}); the site will use system fonts.`);
});

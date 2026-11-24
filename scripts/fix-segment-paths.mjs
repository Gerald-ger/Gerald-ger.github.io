// Works around a Windows-only Next.js export bug (seen in 16.4.6).
//
// For client-side prefetching, `next build` writes per-segment payloads named like
// `__next.$d$lens.__PAGE__.txt`. It builds that name from path.relative(), which uses
// backslashes on Windows, but only replaces forward slashes with dots. On Windows the
// payload therefore lands at `__next.$d$lens/__PAGE__.txt` (a folder), and prefetches 404.
//
// This script flattens such folders back into dotted files. On Linux and macOS (including
// the GitHub Actions deploy) there is nothing to fix and it exits quietly.
import { readdir, rename, rm, stat } from "node:fs/promises";
import { join, relative, sep } from "node:path";

const OUT = join(process.cwd(), "out");

async function filesUnder(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) => (e.isDirectory() ? filesUnder(join(dir, e.name)) : [join(dir, e.name)]))
  );
  return nested.flat();
}

async function walk(dir) {
  let fixed = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("__next.")) {
      for (const file of await filesUnder(full)) {
        const flat = `${entry.name}.${relative(full, file).split(sep).join(".")}`;
        await rename(file, join(dir, flat));
        fixed++;
      }
      await rm(full, { recursive: true, force: true });
    } else {
      fixed += await walk(full);
    }
  }
  return fixed;
}

try {
  await stat(OUT);
  const fixed = await walk(OUT);
  if (fixed) console.log(`fix-segment-paths: flattened ${fixed} prefetch payloads`);
} catch (err) {
  if (err.code !== "ENOENT") throw err;
}

import path from "node:path";
import fs from "node:fs/promises";
import fg from "fast-glob";
import sharp from "sharp";

const repoRoot = process.cwd();
const srcRoot = path.join(repoRoot, "src");

const INPUT_DIRS = [
  "src/assets/images/Home",
  "src/assets/images/features",
  "src/assets/images/Prizing",
  "src/assets/images/Usecases",
  "src/assets/images/Tutorial-Tumbnails",
];

// Output goes alongside existing assets but separated, so original filenames keep working.
const OUT_BASE = "src/assets/images-optimized";

const MAX_WIDTH_BY_PATH = [
  { match: "/features/Features-Icons/", maxWidth: 256 },
  { match: "/Home/Features-Icons/", maxWidth: 256 },
  { match: "/Home/Review-customers-images/", maxWidth: 384 },
  { match: "/Tutorial-Tumbnails/", maxWidth: 1280 },
  { match: "/features/", maxWidth: 1600 },
  { match: "/Usecases/", maxWidth: 1800 },
  { match: "/Home/", maxWidth: 1800 },
  { match: "/Prizing/", maxWidth: 1800 },
];

function maxWidthFor(relPosix) {
  const hit = MAX_WIDTH_BY_PATH.find((r) => relPosix.includes(r.match));
  return hit?.maxWidth ?? 1600;
}

function toPosix(p) {
  return p.split(path.sep).join("/");
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function optimizeOne(absIn) {
  const relFromSrc = path.relative(srcRoot, absIn); // e.g. assets/images/Home/..../x.png
  const relFromSrcPosix = toPosix(relFromSrc);

  const outRel = relFromSrcPosix
    .replace(/^assets\/images\//, `${OUT_BASE.replace(/^src\//, "")}/`)
    .replace(/\.(png|jpe?g)$/i, ".webp");

  const absOut = path.join(srcRoot, outRel);
  const absOutDir = path.dirname(absOut);

  const inStat = await fs.stat(absIn);
  const outExists = await fileExists(absOut);
  if (outExists) {
    const outStat = await fs.stat(absOut);
    if (outStat.mtimeMs >= inStat.mtimeMs) return { skipped: true, absOut };
  }

  await ensureDir(absOutDir);

  const maxWidth = maxWidthFor(`/${relFromSrcPosix}`);
  const img = sharp(absIn, { failOn: "none" });
  const meta = await img.metadata();

  const shouldResize = meta.width && meta.width > maxWidth;
  const pipeline = shouldResize ? img.resize({ width: maxWidth, withoutEnlargement: true }) : img;

  await pipeline
    .webp({
      quality: 75,
      effort: 5,
    })
    .toFile(absOut);

  const outStat = await fs.stat(absOut);
  return {
    skipped: false,
    absOut,
    savedBytes: Math.max(0, inStat.size - outStat.size),
    inBytes: inStat.size,
    outBytes: outStat.size,
  };
}

async function main() {
  const patterns = INPUT_DIRS.map((d) => `${d.replace(/\\/g, "/")}/**/*.{png,jpg,jpeg}`);
  const files = await fg(patterns, { onlyFiles: true, dot: false });

  if (!files.length) {
    console.log("No images found to optimize.");
    return;
  }

  let saved = 0;
  let optimized = 0;
  let skipped = 0;

  for (const file of files) {
    const abs = path.isAbsolute(file) ? file : path.join(repoRoot, file);
    try {
      const res = await optimizeOne(abs);
      if (res.skipped) {
        skipped += 1;
      } else {
        optimized += 1;
        saved += res.savedBytes || 0;
      }
    } catch (e) {
      console.warn(`Failed: ${file}`);
      console.warn(e?.message || e);
    }
  }

  console.log(`Optimized: ${optimized}, skipped: ${skipped}`);
  console.log(`Saved ~${(saved / (1024 * 1024)).toFixed(1)} MB`);
  console.log(`Output root: ${OUT_BASE}`);
}

await main();


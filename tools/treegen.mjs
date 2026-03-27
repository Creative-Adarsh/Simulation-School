import fs from "node:fs/promises";
import path from "node:path";

const argv = process.argv.slice(2);

function getArg(name, def = null) {
  const i = argv.indexOf(name);
  if (i === -1) return def;
  const v = argv[i + 1];
  if (!v || v.startsWith("--")) return def;
  return v;
}

function getArgList(name) {
  const v = getArg(name, "");
  if (!v) return [];
  return v.split(",").map(s => s.trim()).filter(Boolean);
}

const root = path.resolve(getArg("--root", "."));
const maxDepth = Number(getArg("--depth", "8"));
const outputFile = getArg("--output", "");
const dirsOnly = argv.includes("--dirs-only");

// Only include these extensions (the “useful files”)
// You can change this list anytime from the command line.
const includeExt = new Set(
  getArgList("--include-ext").map(e => e.startsWith(".") ? e.toLowerCase() : ("." + e.toLowerCase()))
);

// Folders we do NOT want to expand
const EXCLUDE_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".expo",
  "dist",
  "build",
  "coverage",
  ".turbo",
  ".pnpm-store",
  ".cache",
  "__pycache__",
]);

// In these folders, don’t list files (only show subfolders)
const SKIP_FILES_IN_DIRS = new Set([
  "assets",  // mobile assets can be huge
  "public",  // many images/fonts sometimes
]);

function excludeFile(name) {
  if (name === ".DS_Store") return true;
  // Hide env files by default (safe)
  if (/^\.env(\..+)?$/i.test(name)) return true;
  return false;
}

function shouldIncludeFile(fileName) {
  if (excludeFile(fileName)) return false;
  if (includeExt.size === 0) return true; // if user didn't pass --include-ext, include all (except excluded)
  const ext = path.extname(fileName).toLowerCase();
  return includeExt.has(ext);
}

async function listDir(dirPath) {
  const base = path.basename(dirPath);

  const items = await fs.readdir(dirPath, { withFileTypes: true });

  let filtered = items.filter((d) => {
    if (d.isDirectory()) return true;

    if (dirsOnly) return false;

    // if folder is in SKIP_FILES_IN_DIRS, hide files
    if (SKIP_FILES_IN_DIRS.has(base)) return false;

    return shouldIncludeFile(d.name);
  });

  // Sort: directories first, then files; alphabetical
  filtered.sort((a, b) => {
    if (a.isDirectory() !== b.isDirectory()) return a.isDirectory() ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return filtered;
}

async function walk(dirPath, prefix, depth, lines) {
  if (depth > maxDepth) return;

  let entries;
  try {
    entries = await listDir(dirPath);
  } catch {
    return;
  }

  for (let i = 0; i < entries.length; i++) {
    const ent = entries[i];
    const isLast = i === entries.length - 1;

    const connector = isLast ? "\\-- " : "|-- ";
    const nextPrefix = prefix + (isLast ? "    " : "|   ");
    const fullPath = path.join(dirPath, ent.name);

    if (ent.isDirectory()) {
      if (EXCLUDE_DIRS.has(ent.name)) {
        lines.push(prefix + connector + ent.name + "  [skipped]");
        continue;
      }
      lines.push(prefix + connector + ent.name);
      await walk(fullPath, nextPrefix, depth + 1, lines);
    } else {
      lines.push(prefix + connector + ent.name);
    }
  }
}

async function main() {
  const lines = [];
  lines.push(path.basename(root));
  await walk(root, "", 1, lines);

  const out = lines.join("\n");
  if (outputFile) {
    await fs.writeFile(outputFile, out, "utf8");
  } else {
    process.stdout.write(out + "\n");
  }
}

main();
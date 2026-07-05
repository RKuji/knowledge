import { cpSync, existsSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(rootDir, "node_modules", "tinymce");
const dest = path.join(rootDir, "public", "tinymce");

if (!existsSync(src)) {
  console.error("tinymce package not found in node_modules; skipping asset copy.");
  process.exit(0);
}

rmSync(dest, { recursive: true, force: true });
cpSync(src, dest, { recursive: true });

console.log(`Copied tinymce assets to ${path.relative(rootDir, dest)}`);

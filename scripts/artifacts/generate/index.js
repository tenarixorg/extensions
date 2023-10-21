/* eslint-disable no-undef */
import fs from "fs";
import { fileURLToPath } from "url";
import { packExtension } from "./common/index.js";
import { join } from "path";

const __dirname = join(fileURLToPath(import.meta.url), "..");
const __root = join(__dirname, "../../../extensions/");

const exts = fs.readdirSync(__root);

const table = [];

for (const ext of exts) {
  const path = join(__root, ext);
  const res = await packExtension(path);
  table.push(res);
}
// eslint-disable-next-line no-console
console.table(table, ["name", "lang", "version", "author"]);

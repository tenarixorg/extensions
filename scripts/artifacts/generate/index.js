/* eslint-disable no-undef */
import fs from "fs";
import { fileURLToPath } from "url";
import { packExtension } from "./common/index.js";
import { join } from "path";

const __dirname = join(fileURLToPath(import.meta.url), "..");
const __base = join(__dirname, "../../..");
const __root = join(__dirname, "../../../extensions/");

const exts = fs.readdirSync(__root);

const extensions = [];

for (const ext of exts) {
  const path = join(__root, ext);
  const res = await packExtension(path);
  extensions.push(res);
}
// eslint-disable-next-line no-console
console.table(extensions, ["name", "lang", "version", "author"]);

fs.writeFileSync(
  join(__base, "info.json"),
  JSON.stringify(extensions, null, 2)
);

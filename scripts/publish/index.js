/* eslint-disable no-undef */
import fs from "fs";
import ora from "ora";
import { fileURLToPath } from "url";
import { addExtension } from "@tenarix/ext-uploader";
import { config } from "dotenv";
import { join } from "path";

const __dirname = join(fileURLToPath(import.meta.url), "..");
const __root = join(__dirname, "../../extensions/");

config();

const { TOKEN } = process.env;

if (!TOKEN) {
  ora("Missing environment variables").fail();
  process.exit(1);
}

const exts = fs.readdirSync(__root);

for (const ext of exts) {
  const path = join(__root, ext);
  await addExtension({
    secret: TOKEN,
    path,
  });
}

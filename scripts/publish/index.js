/* eslint-disable no-undef */
import fs from "fs";
import ora from "ora";
import { fileURLToPath } from "url";
import { npmPublish } from "@jsdevtools/npm-publish";
import { config } from "dotenv";
import { join } from "path";

const __dirname = join(fileURLToPath(import.meta.url), "..");
const __root = join(__dirname, "../../extensions/");

config();

const { TOKEN, REGISTRY } = process.env;

if (!TOKEN || !REGISTRY) {
  ora("Missing environment variables").fail();
  process.exit(1);
}

const exts = fs.readdirSync(__root);

for (const ext of exts) {
  const packageJson = join(__root, ext, "package.json");
  const loading = ora(`Publishing ${ext}`).start();
  await npmPublish({
    quiet: true,
    token: TOKEN,
    access: "public",
    checkVersion: true,
    registry: REGISTRY,
    package: packageJson,
  });
  loading.succeed(`${ext} published`);
  loading.stop();
}

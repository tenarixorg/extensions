/* eslint-disable no-undef */
import ora from "ora";
import pack from "npm-packlist";
import { join, resolve } from "path";
import { readFileSync, mkdirSync, existsSync } from "fs";
import { create } from "tar";

const getErrors = (extension) => {
  const errors = [];
  if (!extension.name) {
    errors.push("name");
  }
  if (!extension.lang) {
    errors.push("lang");
  }
  if (!extension.version) {
    errors.push("version");
  }
  return errors;
};

export const packExtension = async (path) => {
  const path_ = resolve(path);
  const baseT =
    "https://raw.githubusercontent.com/tenarixorg/extensions/artifacts/tarballs/";
  try {
    const packageJson = JSON.parse(
      readFileSync(`${path_}/package.json`, "utf8")
    );
    const readme = readFileSync(`${path_}/README.md`, "utf8");
    const errors = getErrors(packageJson);
    const eL = errors.length;
    if (eL > 0) {
      const rest = "missing in package.json";
      ora(`${errors.join(", ")} ${eL === 1 ? "is" : "are"} ${rest}`).fail();
      return;
    }
    const spinner = ora("Creating tarball...").start();
    const tgz = `${packageJson.name}_${packageJson.version}.tgz`;
    const data = {
      name: packageJson.name,
      lang: packageJson.lang,
      version: packageJson.version,
      description: packageJson?.description || "",
      readme: readme || "",
      author: packageJson?.author || "",
      tarball: baseT + tgz,
    };

    const tarballs = resolve(path_, "../../tarballs/");

    if (!existsSync(tarballs)) {
      mkdirSync(tarballs, {
        recursive: true,
      });
    }

    const fullPath = join(tarballs, tgz);
    try {
      const files = await pack({
        path,
      });
      await create(
        {
          prefix: data.name,
          cwd: path_,
          gzip: true,
          file: fullPath,
        },
        files
      );
      spinner.succeed(`Tarball created: ${fullPath}`);
      return data;
    } catch (error) {
      spinner.fail(error.message);
      return;
    }
  } catch (error) {
    ora(error.message).fail();
    return;
  }
};

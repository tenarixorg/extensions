/* eslint-disable no-undef */
import ora from "ora";
import pack from "npm-packlist";
import { join, resolve } from "path";
import fs from "fs";
import { create } from "tar";

const getRaw = (folder, name) => {
  const base = "raw.githubusercontent.com/tenarixorg/extensions/artifacts";
  return `https://${base}/${folder}/${name}`;
};

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
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(`${path_}/package.json`, "utf8")
    );
    const readme = fs.readFileSync(`${path_}/README.md`, "utf8");
    const errors = getErrors(packageJson);
    const eL = errors.length;
    if (eL > 0) {
      const rest = "missing in package.json";
      ora(`${errors.join(", ")} ${eL === 1 ? "is" : "are"} ${rest}`).fail();
      return;
    }
    const spinner = ora("Creating tarball...").start();
    const tgz = `${packageJson.name}_${packageJson.version}.tgz`;
    const md = `${packageJson.name}_${packageJson.version}.md`;
    const data = {
      name: packageJson.name,
      author: packageJson?.author || "",
      lang: packageJson.lang,
      version: packageJson.version,
      description: packageJson?.description || "",
      readme: getRaw("readmes", md),
      tarball: getRaw("tarballs", tgz),
    };

    const tarballs = resolve(path_, "../../tarballs/");
    const readmes = resolve(path_, "../../readmes/");

    if (!fs.existsSync(tarballs)) {
      fs.mkdirSync(tarballs, {
        recursive: true,
      });
    }
    if (!fs.existsSync(readmes)) {
      fs.mkdirSync(readmes, {
        recursive: true,
      });
    }

    const tarballPath = join(tarballs, tgz);
    const readmePath = join(readmes, md);
    try {
      const files = await pack({
        path,
      });
      await create(
        {
          prefix: data.name,
          cwd: path_,
          gzip: true,
          file: tarballPath,
        },
        files
      );
      spinner.succeed(`Tarball created: ${tarballPath}`);
      fs.writeFileSync(readmePath, readme);
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

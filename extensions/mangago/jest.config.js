/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();

const { platform } = require("os");

const getChrome = (platf) => {
  switch (platf) {
    case "win32":
      return process.env.CHROME_WIN;
    case "linux":
      return process.env.CHROME_LINUX;
    case "darwin":
      return process.env.CHROME_MAC;
    default:
      return process.env.CHROME_LINUX;
  }
};

process.env.CHROME = getChrome(platform());

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./",
  verbose: true,
  silent: false,
  detectOpenHandles: false,
  collectCoverage: true,
  coverageDirectory: "./coverage",
};

#!/bin/bash

# Refresh info
rm -rf artifacts/info.json
cp -r info.json artifacts/info.json
# Refresh tarballs
rm -rf artifacts/tarballs
cp -r tarballs artifacts/tarballs
# Refresh readmes
rm -rf artifacts/readmes
cp -r readmes artifacts/readmes
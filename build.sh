#!/usr/bin/env sh

rm -rf tmp
mkdir -p tmp bin
trap 'rm -rf tmp' EXIT

esbuild src/main.js --bundle --platform=node --outfile=tmp/main.js --loader:.ico=dataurl --loader:.desktop=text
node --experimental-sea-config sea-config.json
cp $(command -v node) bin/vortex-linux
postject bin/vortex-linux NODE_SEA_BLOB tmp/sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2

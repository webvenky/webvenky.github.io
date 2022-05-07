#!/bin/sh

set -e

wget "http://sinonjs.org/releases/sinon-$1.js" -O sinon.js
sed -i 's/\("version": "\)[0-9.]\+/\1'"$1"/ package.json
git commit package.json sinon.js -m "Sinon.js version $1"
git tag "$1"
# Do not forget: npm publish --tag $1

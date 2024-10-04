#!/bin/bash
set -eu
IFS=$'\n\t'

# Build everything
yarn build:gql
yarn vite build --mode $CDK_STAGE

# get the current version and commit hash
version=$(grep -m1 version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g')
commit=$(git rev-parse --short HEAD)$(if [ ! -z "$(git status -s)" ]; then echo "*"; fi) # get short commit hash, append * if working directory not clean

# Linux has different `sed` options than OSX
SEDOPTION=""
if [[ "$OSTYPE" == "darwin"* ]]; then
  SEDOPTION="-i ''"
else
  SEDOPTION="-i "
fi

# inject version and commit hash into index.html
sed $SEDOPTION "s/%VERSION%/$version/" build/index.html
sed $SEDOPTION "s/%COMMIT%/$commit/" build/index.html
sed $SEDOPTION "s/%STAGE%/$CDK_STAGE/" build/index.html

echo "Finished injecting VERSION and COMMIT"
#!/bin/bash
set -e # Exit with nonzero exit code if anything fails
# set -x # Uncomment to debug this script

if [ -z "${CLOUDFRONT_DISTRIBUTION}" ]; then
  echo "CLOUDFRONT_DISTRIBUTION is not set. Exiting."
  exit 1
fi
if [ -z "${WEB_BUCKET}" ]; then
  echo "WEB_BUCKET is not set. Exiting."
  exit 1
fi

# If buid folder exists delete it
if [ -d "build" ]; then
  echo "DETECTED BUILD FOLDER. DELETING IT."
  rm -rf build
fi

yarn build 

# but ignore the stats/* folder
aws s3 sync build/ s3://${WEB_BUCKET} --delete --exclude "stats/*"
aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION} --paths "/*" --output text --no-cli-pager

echo "Deployment completed successfully."
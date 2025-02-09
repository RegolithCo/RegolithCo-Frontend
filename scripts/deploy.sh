#!/bin/bash

if [ -z "${CLOUDFRONT_DISTRIBUTION}" ]; then
  echo "CLOUDFRONT_DISTRIBUTION is not set. Exiting."
  exit 1
fi
if [ -z "${WEB_BUCKET}" ]; then
  echo "WEB_BUCKET is not set. Exiting."
  exit 1
fi

# but ignore the stats/* folder
aws s3 sync build/ s3://${WEB_BUCKET} --delete --exclude "stats/*"
aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION} --paths "/*"
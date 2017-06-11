#!/usr/bin/env bash

npm run --silent unit
ERR = $?

if [[ $ERR != 0 ]]; then
  exit $ERR
fi

if [[ -z $CI ]]
then
  echo "Skipping upload"
else
  bash <(curl -s https://codecov.io/bash) -f coverage/coverage.json
fi

#!/bin/bash
echo -n "Building docs..."
cd docs
npm run --silent doc
ERR=$?
tput el
if [[ $ERR == 0 ]]; then
  echo -en "\033[1K\r\x1b[32mDocs Built ✓\x1b[39m"
else
  echo "Failed: " $ERR
fi

#!/bin/sh

if [ ! -d "node_modules" ]; then
  echo "Run npm install...";
  npm install;
fi

npm run devserver;
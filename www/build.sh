#!/bin/bash

set -e

npm install
./node_modules/.bin/webpack -d

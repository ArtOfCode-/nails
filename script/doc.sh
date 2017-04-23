#!/bin/bash
jsdoc2md $@ --member-index-format=list src/*.js src/**/*.js > docs/api/index.md

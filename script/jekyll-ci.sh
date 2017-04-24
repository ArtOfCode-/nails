#!/bin/bash

cd docs
git clone -b gh-pages https://$GH_TOKEN@github.com/ArtOfCode-/nails _site
rm -r _site/*

echo "$ ruby --version"
ruby --version

echo "$ bundle install --deployment"
bundle install --deployment

echo "$ npm run doc"
npm run doc
cp api/index.md /tmp/api-initial.md
echo -e "---\ntitle: API\n---" | cat - /tmp/api-initial.md > api/index.md
rm /tmp/api-initial.md

echo "$ jekyll build"
JEKYLL_GITHUB_TOKEN=$GH_TOKEN JEKYLL_ENV=production bundle exec jekyll build --incremental --profile

cd _site
git add .

OLD_EMAIL=$(git config user.email)
OLD_NAME=$(git config user.name)
git config push.default matching
git config --replace-all user.email "git+nails-bot@twopointzero.us"
git config --replace-all user.name "Nails Bot"
if [[ $TRAVIS_COMMIT != "" ]]
then
  git commit -qm "Update site for $TRAVIS_COMMIT"
  git push -q
else
  git commit -qm "Update site for <unknown commit>"
  echo -e "Skipped upload."
fi
if [[ $OLD_EMAIL != "" ]]; then
  git config user.email $OLD_EMAIL
fi
if [[ $OLD_NAME != "" ]]; then
  git config user.name $OLD_NAME
fi

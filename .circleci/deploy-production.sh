# Deploying to Heroku manually so that we can force push
cat >~/.netrc <<EOF
machine api.heroku.com
  login $HEROKU_EMAIL
  password $HEROKU_TOKEN
machine git.heroku.com
  login $HEROKU_EMAIL
  password $HEROKU_TOKEN
EOF

# Heroku CLI complains about permissions without this
chmod 600 ~/.netrc
[[ ! -s "$(git rev-parse --git-dir)/shallow" ]] || git fetch --unshallow
git push --force git@heroku.com:msu-lansing-codes.git $CIRCLE_SHA1:refs/heads/master

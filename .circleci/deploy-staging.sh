[[ ! -s "$(git rev-parse --git-dir)/shallow" ]] || git fetch --unshallow
git push --force https://heroku:$HEROKU_API_KEY@git.heroku.com/msu-codes-staging.git $CIRCLE_SHA1:refs/heads/master

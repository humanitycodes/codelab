[[ ! -s "$(git rev-parse --git-dir)/shallow" ]] || git fetch --unshallow
git push --force git@heroku.com:msu-codes-staging.git $CIRCLE_SHA1:refs/heads/master

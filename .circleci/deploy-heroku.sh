# usage: ./deploy-heroku.sh msu-codes-staging
[[ ! -s "$(git rev-parse --git-dir)/shallow" ]] || git fetch --unshallow
git push --force https://heroku:$HEROKU_API_KEY@git.heroku.com/$1.git $CIRCLE_SHA1:refs/heads/master

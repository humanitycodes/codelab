# Setup access to Heroku domains
cat > ~/.netrc <<EOF
machine api.heroku.com
  login $HEROKU_EMAIL
  password $HEROKU_TOKEN
machine git.heroku.com
  login $HEROKU_EMAIL
  password $HEROKU_TOKEN
EOF

chmod 600 ~/.netrc

# Allow SSH connection to Heroku servers without interactive input
mkdir -p ~/.ssh
chmod 700 ~/.ssh

cat >> ~/.ssh/config << EOF
  VerifyHostKeyDNS yes
  StrictHostKeyChecking no
EOF

chmod 600 ~/.ssh/config

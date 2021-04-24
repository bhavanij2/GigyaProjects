#!/bin/bash

. ~/.bashrc

NODE_VERSION=v10.0.0

nvm --version || (echo "Installing nvm"; curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash)

nvm ls ${NODE_VERSION} || (echo "Installing node version ${NODE_VERSION}"; nvm install ${NODE_VERSION})

nvm use default ${NODE_VERSION}

nvm use ${NODE_VERSION}

npm config set @monsantoit:registry https://npm.platforms.engineering
npm config set @gdx:registry https://npm.platforms.engineering
npm config set registry "https://registry.npmjs.com/"

npm i npm@latest --global

if [ ! -f /tmp/jq ]; then
    echo "installing jq"
    curl -L https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 > /tmp/jq
    chmod +x /tmp/jq
fi

export PATH="$PATH:/tmp"

echo $PATH

pip install --upgrade --user awscli

which expect || (echo "installing expect"; sudo apt-get update; sudo apt-get --assume-yes install expect)

npm i --global @monsantoit/get_aws_cf_temp_token


echo "Finished setup"
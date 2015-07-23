#!/bin/bash

echo "*******************************"
echo "Provisioning virtual machine..."
echo "*******************************"


echo "***********************"
echo "Updating apt sources..."
echo "***********************"
#sudo apt-key adv --keyserver hkp://keyserver-recv 7F0CEB10
#echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | sudo tee /etc/apt/sources.list.d/mongodb.list
sudo apt-get -qq update


echo "***********************************"
echo "Install and re-link node and npm..."
echo "***********************************"

echo "***Install node and usefull linux modules***"

curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install --yes nodejs
#sudo apt-get -y -qq install mongodb-org git build-essential openssl libssl-dev pkg-config ruby-full
sudo apt-get -y -qq install git build-essential openssl libssl-dev pkg-config ruby-full
sudo gem install sass

echo "***Create global npm directory***"

mkdir "/home/integ4afpa/npm-global"
echo -e "\n# File with proper rights for npm\nexport PATH=~/npm-global/bin:$PATH" >> /home/integ4afpa/.profile
source "/home/integ4afpa/.profile"

echo "***Manage NODE_PATH issues***"

echo -e "\n# Custom NODE_PATH\nexport NODE_PATH=$NODE_PATH:/home/integ4afpa/npm-global/lib/node_modules" >> /home/integ4afpa/.bashrc
source "/home/integ4afpa/.bashrc"


echo "***Update npm and install global modules***"

npm config set prefix '/home/integ4afpa/npm-global'
npm i -g npm@latest
npm i -g bower grunt-cli yo generator-angular-fullstack node-inspector

echo "***Set proper rights on npm-global directory***"

sudo chown -R integ4afpa /home/integ4afpa/npm-global


echo "*********************************"
echo "Success!"
echo "*********************************"

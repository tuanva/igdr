#!/bin/bash


read -p 'IG Username: ' user
sed -i -e"s/^IG_USERNAME=.*/IG_USERNAME=$user/" .env

read -sp 'IG Password: ' pass
sed -i -e"s/^IG_PASSWORD=.*/IG_PASSWORD=$pass/" .env

echo 'Starting the app...'

npm install

node index.js

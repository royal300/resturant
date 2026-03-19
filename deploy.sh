#!/bin/bash
set -e

echo "Building the application..."
npm install
npm run build

echo "Deploying to VPS at 93.127.206.52..."
echo "You may be prompted for the VPS password (Royal300@2026)."
rsync -avz --delete --exclude 'api/' --exclude 'assets/dishes/' --exclude 'assets/combos/' --exclude 'assets/categories/' dist/ root@93.127.206.52:/var/www/royal_restaurant/
rsync -avz api/ root@93.127.206.52:/var/www/royal_restaurant/api/

echo "Fixing permissions on VPS..."
ssh root@93.127.206.52 "chown -R www-data:www-data /var/www/royal_restaurant/assets && chmod -R 777 /var/www/royal_restaurant/assets"

echo "Deployment successful! The application is updated at https://restaurant.royal300.com"

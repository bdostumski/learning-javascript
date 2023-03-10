#!/usr/bin/env bash

apt-get update
apt-get install -y apache2
rm -r /var/www/html/*
cp -r /vagrant/* /var/www/html


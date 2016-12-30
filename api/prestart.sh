#!/bin/sh

while [[ "$(curl -s http://${CONSUL_HOST}:8500/v1/health/service/db | grep passing)" = ""  ]]
do
  echo "db is not yet healthly...."
  sleep 5
done

echo "db is healthly, moving on..."

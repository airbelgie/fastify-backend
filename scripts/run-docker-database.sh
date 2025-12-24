#!/bin/bash -x

docker pull postgres:18

echo "--- Stopping existing container (if running) ---"
docker stop airbelgie_db 

echo "--- Removing existing container ---"
docker rm airbelgie_db 

echo "--- Starting new container ---"
docker run --name airbelgie_db -e POSTGRES_PASSWORD=test -e POSTGRES_USER=airbelgie -e POSTGRES_DB=airbelgie -p 127.0.0.1:5432:5432 -v airbelgie_data:/var/lib/postgresql -d postgres:18
echo "--- Stopping existing container (if running) ---"
docker stop airbelgie_backend 
echo "--- Removing existing container ---"
docker rm airbelgie_backend 
echo "--- Starting new container ---"
docker run --init --name airbelgie_backend -e COMMIT_SHA=local -e PGPORT=5432 -e PGHOST=airbelgie_db -e PGUSER=airbelgie -e PGPASSWORD=test -e PGDATABASE=airbelgie --network airbelgie -p 3008:3008 $(docker build -q .)
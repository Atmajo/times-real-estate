cd times-real-estate

echo 'Stopping Docker containers...'
docker compose down --remove-orphans

echo 'Cleaning up Docker images...'
docker image prune -f

echo 'Building and starting containers...'
docker compose up --build -d
            
echo 'Deployment complete. Running containers:'
docker ps

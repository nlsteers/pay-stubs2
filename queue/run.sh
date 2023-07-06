docker build --tag 'stubs_queue' .
docker run -p 9324:9324 -p 9325:9325 stubs_queue

git pull
sudo systemctl stop mongod
sudo systemctl restart docker
sudo docker build -t inventory-sync-api:latest .
sudo systemctl start mongod
sudo docker run -d -p 3001:3001 -e MY_DB_NAME=catlitter inventory-sync-api:latest
sudo docker run -d -e API_URL=http://erp.thesellerstack.com:3001  woo-sync:latest

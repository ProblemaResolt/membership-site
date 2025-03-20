# データディレクトリの作成
New-Item -ItemType Directory -Force -Path ".\data\postgres"
New-Item -ItemType Directory -Force -Path ".\data\redis"

# 環境変数の設定
$env:COMPOSE_CONVERT_WINDOWS_PATHS=1

# Dockerの再起動
docker-compose down -v
docker-compose up --build

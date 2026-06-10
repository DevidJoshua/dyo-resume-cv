#!/bin/sh
set -e

echo "Waiting for MySQL..."
for i in $(seq 1 30); do
  node -e "
    const c = require('net').createConnection({host:'mysql',port:3306});
    c.on('connect',()=>process.exit(0));
    c.on('error',()=>process.exit(1));
  " 2>/dev/null && break
  echo "  retry $i..."
  sleep 2
done

echo "Running database migrations..."
npx prisma migrate deploy

if [ "$RUN_SEED" = "true" ]; then
  echo "Seeding database..."
  node prisma/seed.js
fi

echo "Starting server..."
exec node src/index.js

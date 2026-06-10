#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

if [ "$RUN_SEED" = "true" ]; then
  echo "Seeding database..."
  node prisma/seed.js
fi

echo "Starting server..."
exec node src/index.js

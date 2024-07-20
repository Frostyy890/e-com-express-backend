#! /bin/sh
set -e

pnpm prisma migrate dev --name init

exec "$@"
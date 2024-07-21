#! /bin/sh
set -e

pnpm prisma db push

exec "$@"
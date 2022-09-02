#!/bin/sh
set -e

# Generate env for runtime use
yarn react-env --env production

# Execute any subsequent command
exec "$@"
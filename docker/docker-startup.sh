#!/bin/bash
set -e

echo "Starting Redis server..."
redis-server --daemonize yes 

echo "Configuring Redis to continue writes on BGSAVE errors..."
# Configure Redis to prevent write blocking on background save errors
redis-cli CONFIG SET stop-writes-on-bgsave-error no

CELERY_BEAT_SCHEDULE_DIR="/app/celery"

# Start Celery Worker
echo "Starting Celery Worker..."
celery -A superset.tasks.celery_app worker --loglevel=info &

# Start Celery Beat with custom schedule file location
echo "Starting Celery Beat..."
celery -A superset.tasks.celery_app beat --loglevel=info \
    --schedule "${CELERY_BEAT_SCHEDULE_DIR}/celerybeat-schedule" &

sleep 5
#!/bin/bash

APP_PORT=${PORT:-8000}

/opt/venv/bin/gunicorn --worker-tmp-dir /dev/shm clipr.wsgi:application --bind "0.0.0.0:${APP_PORT}"
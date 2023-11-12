#!/bin/sh

echo "Waiting for postgres..."

while ! nc -z 'postgres' 5432; do
  echo "Zzz"
  sleep 0.5
done

echo "PostgreSQL started"

python manage.py flush --no-input
python manage.py migrate


if [ -z "$(python manage.py shell -c 'from django.contrib.auth.models import User; print(User.objects.filter(username="your_superuser_username").exists())')" ]; then
  echo "Creating superuser..."
  python manage.py createsuperuser --no-input
else
  echo "Superuser already exists. Skipping creation."
fi

python manage.py runserver 0.0.0.0:8000
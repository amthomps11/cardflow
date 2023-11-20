#!/bin/sh

# shellcheck disable=SC1073
if [ -f .env ]; then
  export $(dotenv list -e)
  fi

echo "Waiting for postgres..."

while ! nc -z 'postgres' $POSTGRES_PORT; do
  echo "Zzz"
  sleep 0.5
done

echo "PostgreSQL started"


python manage.py flush --no-input
python manage.py migrate

if [ "$(python manage.py shell -c 'from accounts.models import User; print(User.objects.filter(username="admin", email="'"$PGADMIN_DEFAULT_EMAIL"'").exists())')" = "False" ]; then
  echo "Creating superuser..."
  python manage.py shell -c 'from accounts.models import User; User.objects.create_superuser("admin", "'"$PGADMIN_DEFAULT_EMAIL"'", password="'"$PGADMIN_DEFAULT_PASSWORD"'")'
  echo "Superuser is created"
else
  echo "Superuser already exists. Skipping creation."
fi

python manage.py runserver 0.0.0.0:8000


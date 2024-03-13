# Weather app

It's still a bit rough around the edges.

Online demo: https://weather-app-3kwy.onrender.com

## Env vars

You need the following variables defined either in the .env file in `backend` and `frontend`
dirs or in your environment:

### Backend

* `IRON_SESSION_PASS`: password for encrypting the session cookie.
* `DATABASE_URL`: connection string for Postgres.
* `ACCUWEATHER_API_KEY`: your AccuWeather API key.
* `REDIS_URL`: connection string for Redis.
* `FRONTEND_URL`: URL for the static site for CORS.
* `APP_ENV`: should be set to `dev` and unset on production for development.

### Frontend

* `VITE_BACKEND_URL`: URL of the API service that proxies requests to AccuWeather API.


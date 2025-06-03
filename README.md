# HelpDesk — Fullstack Ticketing System

HelpDesk is a full-featured web application for internal ticket management. Employees can create support tickets, technicians can work on them, and administrators manage users, tickets, and categories.

---

## 🛠 Technologies Used

### Backend:
- Python 3.10
- Django 5.x
- Django REST Framework
- SimpleJWT (authentication)
- Redis (caching)
- CORS, dotenv, Pillow

### Frontend:
- Node: 18.x
- npm 9.x
- React + TypeScript
- Bootstrap 5
- React Router

### Infrastructure:
- Docker (20.x) + Docker Compose (1.29+)
- NGINX as reverse proxy
- Prometheus + Grafana

---

## 🧩 User Roles

| Role         | Permissions                                                                |
|--------------|----------------------------------------------------------------------------|
| `employee`   | Creates tickets, views their own tickets, can comment only on their own   |
| `technician` | Sees tickets assigned to them, can comment and change status              |
| `admin`      | Accesses `/admin`: manage users, assign technicians, control categories   |

---

## 🚀 Run Instructions

### 🔧 Local (DEV)

1. Clone the project
```bash
git clone https://github.com/your-username/helpdesk-project.git
cd helpdesk-project
```
2. Install backend dependencies
```bash
# backend
cd backend
python -m venv venv
venv\Scripts\activate  # or source venv/bin/activate
pip install -r requirements.txt
```
3. Apply migrations:
```bash
cd ../backend
python manage.py makemigrations
python manage.py migrate
```

4. Install frontend dependencies
```bash
# frontend
cd ../frontend
npm install
```
5. Copy .env.dev file
```bash
# copy env
cp .env.dev .env
```
6. Run Redis locally
```bash
#via docker
docker run --name redis-local -p 6379:6379 -d redis
```
```bash
#for linux
sudo apt install redis
redis-server
```
```bash
#for windows
download https://www.memurai.com/download
Install and run "Start server"
```

7. Create super user
```bash
cd backend
python manage.py createsuperuser
```
---

### 🐳 Docker

```bash
cp .env.docker .env
docker-compose up --build
```

- Frontend: http://localhost
- API: http://localhost/api/
- Redis: localhost:6379

---

## 🔑 Creating Superuser in Docker

```bash
# Create superuser
docker exec -it helpdesk-backend python manage.py createsuperuser
```
---

## ⚙️ .env variables

| Variable       | Description                             |
|----------------|------------------------------------------|
| `DEBUG`        | True/False                               |
| `SECRET_KEY`   | Django secret key                        |
| `REDIS_HOST`   | redis (in docker) / localhost (local dev)|
| `ALLOWED_HOSTS`| list of allowed domains                  |
| `FRONTEND_URL` | used for password reset links            |

---

## ♻️ Caching

- Redis is used to cache:
  - tickets per user
  - comments per ticket
  - user profiles
- Keys are invalidated on update
- Key format: `ticket_list_{user_id}_{role}`

---

## 🧪 Testing

```bash
python manage.py test
```

- model & API tests included: login, roles, access control

---

## 📊 Monitoring (Prometheus + Grafana)
Monitoring is built-in and launches automatically with Docker Compose.

### What's included
- **Prometheus** - colllects internal metrics from Django (via `/metrics/`)
- **Grafana** - visualizes request rates, errors,latency, and more

### Access
| Service     | URL                             | Credentials       |
|-------------|----------------------------------|-------------------|
| Prometheus  | http://localhost/prometheus/    | (no login needed) |
| Grafana     | http://localhost/grafana/       | admin / admin     |

> ⚠ Prometheus is only accessible from `localhost` (for security)
### 🔄 Reset password (Grafana)

If you forget Grafana login, run:

```bash
docker exec -it helpdesk-grafana grafana-cli admin reset-admin-password admin
```
---
## 📦 Structure

- `backend/` – Django API
- `frontend/` – React UI
- `nginx/` – nginx proxy config
- `.env.*` – environment files
- `docker-compose.yml`
- `backend/logs/helpdesk.log` - file with logs

---
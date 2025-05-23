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
- React + TypeScript
- Bootstrap 5
- React Router

### Infrastructure:
- Docker + Docker Compose
- NGINX as reverse proxy

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

```bash
# clone the project
git clone https://github.com/your-username/helpdesk-project.git
cd helpdesk-project

# backend
cd backend
python -m venv venv
venv\Scripts\activate  # or source venv/bin/activate
pip install -r requirements.txt

# frontend
cd ../frontend
npm install

# copy env
cp .env.dev .env

# run
python ../backend/manage.py runserver
npm run dev

#redis

docker run --name redis-local -p 6379:6379 -d redis

OR

sudo apt install redis
redis-server

OR

download https://www.memurai.com/download
Install and run "Start server"
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

---

## 🔑 Creating Superuser in Docker

```bash
# Create superuser
docker exec -it helpdesk-backend python manage.py createsuperuser

# Then assign 'admin' role:
docker exec -it helpdesk-backend python manage.py shell
>>> from users.models import User
>>> u = User.objects.get(username="admin")
>>> u.role = "admin"
>>> u.save()
>>> exit()
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

## 📦 Structure

- `backend/` – Django API
- `frontend/` – React UI
- `nginx/` – nginx proxy config
- `.env.*` – environment files
- `docker-compose.yml`

---
# HelpDesk — Fullstack system to handle tickets

The project is a complete HelpDesk system for internal use in a company or institution. Employees can create requests, technicians can process them, and the administrator manages users, tickets and categories.

---

## 🛠 Technologies Stack

### Backend:
- Python 3.10
- Django 5.x
- Django REST Framework
- SimpleJWT (authentication)
- Redis (caching)
- Django CORS, dotenv, Pillow

### Frontend:
- React + TypeScript
- Bootstrap 5
- React Router
- Fetch API

### Infrastructure:
- Docker + Docker Compose
- NGINX as reverse proxy

---

## 🚀 How to run

### 🔧 Locally (DEV)

#### 1. Clone project:

```bash
git clone https://github.com/sdobrimutrom/help-desk.git
cd helpdesk-project
```

#### 2. Install dependencies:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

```bash
cd frontend
npm install
```

#### 3. Create `.env` file:

```bash
cp .env.dev .env
```

#### 4. Run:

```bash
# backend
cd backend
python manage.py runserver

# frontend
cd frontend
npm run dev
```

---

### 🐳 With Docker

#### 1. Create `.env.docker`

```bash
cp .env.docker .env
```

#### 2. Run build:

```bash
docker-compose up --build
```

- Frontend: http://localhost
- API: http://localhost/api/
- Redis: localhost:6379

---

## ⚙️ Variables `.env`

| Variable       | Purpose                         |
|----------------|---------------------------------|
| `DEBUG`        | True/False                      |
| `SECRET_KEY`   | Django Secret                   |
| `REDIS_HOST`   | redis / localhost               |
| `ALLOWED_HOSTS`| list of allowed hosts           |
| `FRONTEND_URL` | Frontend URL                    |
|----------------|---------------------------------|
---

## 🔁 Caching

- Redis is caching tickets, comments and user`s profile
- Keys dropping after changes
- Configuration in `settings.py`

---

## 📝 Testing

```bash
python manage.py test
```

Coverage:
- Models and serializators
- Sign Up / Log In / Tickets / Access Rights

---

## 📦 Documentation and additional files

- `docker-compose.yml`
- `nginx/default.conf`
- `.env.example`
- `requirements.txt`

---
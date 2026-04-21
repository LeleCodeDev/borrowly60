# Borrowly

A full-stack item borrowing management application with role-based access control for admins, officers, and borrowers.

**Stack:**

[![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)](https://go.dev)
[![Gin](https://img.shields.io/badge/Gin-008ECF?style=for-the-badge&logo=gin&logoColor=white)](https://gin-gonic.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)](https://ui.shadcn.com)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com)

---

## Features

- **Admin** — full CRUD for users, items, categories, borrows, and returns; activity log
- **Officer** — approve/reject borrow requests, monitor returns, print reports
- **Borrower** — browse items, submit borrow requests, return items

---

## Prerequisites

| Tool | Version |
|------|---------|
| Go | ≥ 1.21 |
| Node.js | ≥ 18 |
| MySQL | ≥ 8.0 |
| wkhtmltopdf | ≥ 0.12.6 |

---

## Database Setup (MySQL)

### 1. Create Database
```bash
CREATE DATABASE borrowly
```

---

## Backend Setup (Go / Gin)

### 2. Install wkhtmltopdf

Required by `go-wkhtmltopdf` for PDF report generation.

**Ubuntu / Debian**
```bash
sudo apt-get update
sudo apt-get install -y wkhtmltopdf
```

**Fedora**
```bash
sudo dnf update
sudo dnf install -y wkhtmltopdf
```

**macOS**
```bash
brew install wkhtmltopdf
```

**Windows**

Download and install the binary from https://wkhtmltopdf.org/downloads.html, then add it to your `PATH`.

Verify the installation:
```bash
wkhtmltopdf --version
```

### 3. Clone and install dependencies

```bash
git clone https://github.com/your-username/borrowly.git
cd borrowly/backend
```

Install all required Go modules:

```bash
go mod tidy
```
or manually :
```bash
go get github.com/SebastiaanKlippert/go-wkhtmltopdf@v1.9.3 github.com/gin-contrib/cors@v1.7.6 github.com/gin-gonic/gin@v1.11.0 github.com/go-playground/validator/v10@v10.30.1 github.com/golang-jwt/jwt/v5@v5.3.1 github.com/google/uuid@v1.6.0 github.com/joho/godotenv@v1.5.1 golang.org/x/crypto@v0.48.0 gorm.io/driver/mysql@v1.6.0 gorm.io/gorm@v1.31.1
```

### 4. Configure environment

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=borrowly

JWT_SECRET=your_jwt_secret
PORT=8080
```

### 5. Migrate the database

```bash
go run cmd/migration/main.go
```

### 6. Seed the database

```bash
go run cmd/seeder/main.go
```

### 7. Run the backend

```bash
go run cmd/server/main.go
```

The API will be available at `http://localhost:8080`.

---

## Frontend Setup (React / Vite)

### 1. Install dependencies

```bash
cd borrowly/frontend
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

```env
VITE_APP_BASE_URL=http://localhost:8080/api
```

### 3. Run the frontend

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Project Structure

```
borrowly/
├── backend
│   ├── cmd
│   │   ├── migration
│   │   ├── seeder
│   │   └── server
│   ├── internal
│   │   ├── bootstrap
│   │   ├── config
│   │   ├── database
│   │   ├── dto
│   │   ├── handler
│   │   ├── mapper
│   │   ├── middleware
│   │   ├── model
│   │   ├── repository
│   │   └── service
│   ├── pkg
│   │   ├── errors
│   │   ├── image
│   │   ├── jwt
│   │   ├── pagination
│   │   ├── response
│   │   └── types
│   ├── template
│   ├── uploads
│   ├── go.mod
│   └── go.sum
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── assets
│   │   ├── components
│   │   │   ├── borrow
│   │   │   ├── category
│   │   │   ├── item
│   │   │   ├── return
│   │   │   ├── ui
│   │   │   ├── user
│   │   ├── guards
│   │   ├── hooks
│   │   │   ├── api
│   │   ├── lib
│   │   ├── pages
│   │   │   ├── admin
│   │   │   ├── auth
│   │   │   ├── borrower
│   │   │   ├── officer
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── README.md
```

---

## Running in Production

### Backend
```bash
go build -o borrowly-server cmd/server/main.go
./borrowly-server
```

### Frontend
```bash
npm run build
```

Serve the `dist/` folder with any static file server (e.g. Nginx, Caddy).
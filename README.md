# 📝 TP1-Nest – CV Management Web App

This is a **NestJS-based web application** for managing CVs and resumes. It features secure user authentication, role-based access control, image uploads, and a PostgreSQL database for persistent storage.


## 🚀 Features

- 🔐 **JWT-based authentication**
- 👤 **Role-based access (Admin & User)**
- 📄 **CRUD operations for CVs**
- 🔍 **Advanced filtering** (name, firstname, job, age)
- 📷 **Image upload with validation** (.jpg, .jpeg, .png)
- 📦 **PostgreSQL integration** via Docker
- 📃 **Generic pagination utility**
- 📚 **Interactive API documentation** with Swagger UI
- 🛡️ **Validation pipes** for data integrity
- � **Rate limiting** for API protection

## ⚙️ Prerequisites

Ensure the following tools are installed:

- [Docker](https://www.docker.com/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/) (v2.5+)
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) (v9+)
- [NestJS CLI](https://docs.nestjs.com/cli/overview)  
  Install globally with:  
  ```bash
  npm install -g @nestjs/cli
  ```

## 🛠️ Setup Instructions

### 1. Clone and Configure
```bash
git clone https://github.com/safina57/TP1-Nest.git
cd TP1-Nest
```

### 2. Environment Setup
Create `.env` file:
```bash
DATABASE_URL="postgresql://postgres:mysecurepassword@localhost:5435/ApplicationDB"
JWT_SECRET=strong_jwt_secret_token
```

### 3. Start Services
```bash
docker compose up --build -d
npm install
npm run start:dev
```

## 📚 API Documentation (Swagger UI)

Access interactive documentation at:  
http://localhost:3000/api


### Endpoint Categories:
- **Auth**: User registration and login
- **Users**: Profile management
- **CVs**: Resume operations
- **Uploads**: Image handling


## 📜 License

This project is licensed under the MIT License.

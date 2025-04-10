# 📝 TP1-Nest – CV Management Web App

This is a **NestJS-based web application** for managing CVs and resumes. It features secure user authentication, role-based access control, image uploads, and a PostgreSQL database for persistent storage.

---

## 🚀 Features

- 🔐 **JWT-based authentication**
- 👤 **Role-based access (Admin & User)**
- 📄 **CRUD operations for CVs**
- 🔍 **Filtering by name, firstname, job, and age**
- 📷 **Image upload with validation (.jpg, .jpeg, .png)**
- 📦 **PostgreSQL integration via Docker**
- 📃 **Generic pagination utility**

---

## ⚙️ Prerequisites

Ensure the following tools are installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Node.js & npm](https://nodejs.org/)
- [NestJS CLI](https://docs.nestjs.com/cli/overview)  
  Install it globally:  
  ```bash
  npm install -g @nestjs/cli
  ```

---

## 🛠️ Setup Instructions

Follow these steps to run the app locally:

```bash
# 1. Clone the repository
git clone https://github.com/safina57/TP1-Nest.git
cd TP1-Nest

# 2. Create a .env file in the root directory and add the following:
DATABASE_URL="postgresql://postgres:mysecurepassword@localhost:5435/ApplicationDB"
JWT_SECRET=your_jwt_secret_key_here

# 3. Start the PostgreSQL container
docker compose up --build -d

# 4. Install dependencies
npm install

# 5. Run the NestJS application
npm run start:dev
```

---

## 📁 Directory Structure

```
src/
├── auth/               # JWT auth logic
├── common/             # Shared utilities (guards, interceptors, etc.)
├── resumes/            # CV CRUD module
├── users/              # User management
├── main.ts             # App entry point
.env                    # Environment variables
docker-compose.yml      # Docker services (PostgreSQL)
public/uploads/         # Uploaded images (served statically)
```

---

## 🖼️ Image Upload

- Accepts: `.jpg`, `.jpeg`, `.png`
- Max file size: `1MB`
- Uploads are saved to: `public/uploads`
- This folder is **served statically** by NestJS

---

## 🔐 Roles & Access

- **Admin**:
  - Can access and manage all CVs.
- **User**:
  - Can only manage their own CVs.

---

## 🧪 Example `.env` File

```env
DATABASE_URL="postgresql://postgres:mysecurepassword@localhost:5435/ApplicationDB"
JWT_SECRET=my_super_secret_key
```

# 📝 TP1-Nest – CV Management Web App

A NestJS-based application for managing CVs/resumes.  
Features secure user authentication, role-based access control, image uploads, PostgreSQL persistence, GraphQL API with auto‑generated schema, Swagger REST docs, and database seeding.

## Features

- NestJS + TypeScript, GraphQL (Apollo) & REST (Swagger)
- JWT authentication & role‑based guards (`USER`/`ADMIN`)
- File upload (images) with validation (size/type)
- Prisma ORM with PostgreSQL
- Auto‑generated GraphQL schema at `src/schema.gql`
- Database seeding (20 users, 20 skills, 50 CVs)
- Docker & Docker Compose setup
- TODO: add a GraphQL subscription to notify on CV creation, updates and deletion

## Prerequisites

- Node.js ≥22
- Docker & Docker Compose (optional)
- PostgreSQL (or use Docker)

## Getting Started

1. Clone the repo

   ```bash
   git clone https://github.com/safina57/TP1-Nest.git && cd tp1-nest
   git checkout tp2
   ```

2. Install dependencies

   ```bash
   npm i
   ```

3. Create a `.env` file at project root:

   ```env
   JWT_SECRET="your_jwt_secret"
   JWT_EXPIRATION= 36000
   DATABASE_URL="postgresql://postgres:mysecurepassword@localhost:5435/ApplicationDB?schema=public"
   ```

4. Run database migrations & generate Prisma client
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

## Run the App

### Development

```bash
npm run start:dev
```

### Production

```bash
npm run build
npm run start:prod
```

### Docker

```bash
docker-compose up --build
```

- API at `http://localhost:3000`
- Swagger UI at `http://localhost:3000/api`
- GraphQL Playground at `http://localhost:3000/graphql`

## Seeding Data

```bash
npm run seed:cvs
```

## API Documentation

### REST (Swagger)

Visit `http://localhost:3000/api`

### GraphQL

- Schema file: `src/schema.gql`
- Queries & mutations:
  - `users`, `user(id)`, `createUser`, `updateUser`, `removeUser`
  - `cvs`, `cv(id)`, `createCv`, `updateCv`, `removeCv`
  - `skills`, `skill(id)`, `createSkill`, `updateSkill`, `removeSkill`
- To upload files, use the `createCv` mutation with an `Upload` scalar.

#### Example: Using createCv in Postman

1. Set request to POST `http://localhost:3000/graphql`.
2. Under **Headers**, add:
   - `Content-Type`: `multipart/form-data`
   - `x-apollo-operation-name`: `CreateCv`
3. In the **Body** tab, select **form-data** and add:

   - Key: `operation` (Text)  
     Value:

     ```json
     {
       "query": "mutation CreateCv($file: Upload!, $input: CreateCvInput!) { createCv(file: $file, createCvInput: $input) { path } }",
       "variables": {
         "file": null,
         "input": {
           "firstName": "test",
           "name": "test",
           "cin": "025777",
           "age": 50,
           "job": "test"
         }
       }
     }
     ```

   - Key: `map` (Text)  
     Value:

     ```json
     { "0": ["variables.file"] }
     ```

   - Key: `0` (File) — select an image file from your computer.

4. Send the request. The response will include the `path` of the uploaded CV image.

## Project Structure

```
src/
├─ auth/         # authentication modules, JWT strategy, guards
├─ cvs/          # CV resolver, service, DTOs, entities
├─ file-upload/  # upload service & validation pipe
├─ prisma/       # Prisma service & module
├─ seed/         # seeding service & command
├─ skills/       # skill resolver, service, DTOs, entities
├─ users/        # user resolver, service, DTOs, entities
├─ common/       # shared modules & base service
├─ app.module.ts # root module
└─ main.ts       # bootstrap
```

## License

This project is released under the UNLICENSED license.  
Feel free to adapt and extend!

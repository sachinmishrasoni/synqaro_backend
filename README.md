# SYNQARO Backend

Backend service for the SYNQARO application built with Node.js, Express.js, Sequelize ORM, and MariaDB.

## Tech Stack

* Node.js
* Express.js
* Sequelize ORM
* MariaDB
* JWT Authentication
* Multer
* Nodemailer

## Project Setup

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=synqaro
DB_USER=root
DB_PASSWORD=password

JWT_SECRET=your_secret_key
```

### Run Development Server

```bash
npm run dev
```

### Run Production Server

```bash
npm start
```

## Database Commands

### Run Migrations

```bash
npx sequelize-cli db:migrate
```

### Undo Last Migration

```bash
npx sequelize-cli db:migrate:undo
```

### Run Seeders

```bash
npx sequelize-cli db:seed:all
```

### Undo Seeders

```bash
npx sequelize-cli db:seed:undo:all
```

## API Documentation

Postman collection can be found in:

```text
docs/postman/
```

## Folder Structure

Detailed project structure documentation:

```text
docs/architecture/project-structure.md
```

## Coding Guidelines

* Follow module-based architecture.
* Keep controllers lightweight.
* Move business logic into services.
* Use centralized response handlers.
* Use async/await consistently.
* Validate request payloads before processing.

## Branch Strategy

```text
main      -> Production
dev       -> Development
feature/* -> New Features
bugfix/*  -> Bug Fixes
```

## License

Internal Project - SYNQARO

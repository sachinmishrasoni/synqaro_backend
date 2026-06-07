# Project Structure

```text
SYNQARO/
│
├── docs/
│   ├── architecture/
│   │   └── project-structure.md
│   │
│   ├── database/
│   │   ├── er-diagram.png
│   │   └── schema.md
│   │
│   └── postman/
│       ├── Synqaro API Collection.json
│       └── environment.sample.json
│
├── migrations/
├── seeders/
├── public/
│
├── src/
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── upload.middleware.js
│   │   └── validation.middleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── index.js
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   │   ├── controller.js
│   │   │   ├── service.js
│   │   │   ├── validation.js
│   │   │   └── routes.js
│   │   │
│   │   ├── users/
│   │   │   ├── controller.js
│   │   │   ├── service.js
│   │   │   ├── validation.js
│   │   │   └── routes.js
│   │   │
│   │   └── ...
│   │
│   ├── routes/
│   │   └── index.js
│   │
│   ├── shared/
│   │   ├── constants/
│   │   ├── helpers/
│   │   ├── services/
│   │   ├── utils/
│   │   └── validators/
│   │
│   ├── templates/
│   │   ├── email/
│   │   └── pdf/
│   │
│   ├── views/
│   │
│   ├── app.js
│   └── index.js
│
├── .env
├── .gitignore
├── .sequelizerc
├── package.json
├── package-lock.json
└── README.md
```

## Directory Explanation

### docs/

Contains project documentation.

### migrations/

Database migration files managed by Sequelize.

### seeders/

Seed data used for development and testing.

### public/

Publicly accessible static files.

### middlewares/

Express middleware functions.

Examples:

* Authentication
* Authorization
* Request validation
* File upload

### models/

Sequelize database models and associations.

### modules/

Feature-based application modules.

Each module contains:

```text
module-name/
├── controller.js
├── service.js
├── validation.js
└── routes.js
```

Responsibilities:

* Controller → Request/Response handling
* Service → Business logic
* Validation → Request validation
* Routes → API endpoints

### routes/

Registers all application routes.

### shared/

Reusable project-wide utilities.

Examples:

* Helpers
* Constants
* Common Services
* Utility Functions
* Validators

### templates/

Email and PDF templates.

### views/

Server-rendered views if required.

### app.js

Express application configuration.

### index.js

Application entry point.

## Architecture Principles

1. Feature-based modular architecture.
2. Thin controllers.
3. Business logic inside services.
4. Reusable utilities inside shared.
5. Centralized error handling.
6. Standard API response structure.
7. Validation before business logic execution.

## Standard Response Format

Success:

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Something went wrong",
  "errors": []
}
```

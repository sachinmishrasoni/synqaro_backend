# Project Structure

```text
SYNQARO/
│
├── docs/
│   ├── architecture/
│   │   └── project-structure.md
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
│   │
│   ├── models/
│   │   └── index.js
│   │
│   ├── modules/
│   │   │
│   │   ├── auth/
│   │   ├── notebook/
│   │   ├── notification/
│   │   ├── profile/
│   │   ├── social/
│   │   ├── todo/
│   │   │
│   │   └── user/
│   │       ├── user.controller.js
│   │       ├── user.model.js
│   │       ├── user.routes.js
│   │       ├── user.schema.js
│   │       └── user.service.js
│   │
│   ├── routes/
│   │   └── index.js
│   │
│   ├── shared/
│   │   ├── config/
│   │   ├── constants/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── templates/
│   ├── views/
│   │
│   ├── app.js
│   └── index.js
│
├── .env
├── .gitignore
├── .sequelizerc
├── jsconfig.json
├── package.json
└── package-lock.json
```

## Architecture Overview

The application follows a **feature-based modular architecture** where each business feature is isolated inside the `modules` directory.

Each module owns its:

* Routes
* Controller
* Service
* Validation Schema
* Model (if required)

This keeps features independent and easier to maintain.

---

## Directory Responsibilities

### docs/

Project documentation.

Examples:

* Architecture documents
* API collections
* Setup guides
* Database documentation

---

### migrations/

Database schema migration files managed through Sequelize.

Examples:

* Create users table
* Add profile fields
* Modify existing schema

---

### seeders/

Database seed data.

Examples:

* Roles
* Permissions
* Sample users

---

### public/

Publicly accessible assets.

Examples:

* Images
* Static files
* Uploads

---

### middlewares/

Express middleware layer.

Examples:

* Authentication
* Authorization
* Request logging
* Error handling
* Validation middleware

---

### models/

Central Sequelize initialization and model registration.

Example:

```js
models/index.js
```

Responsibilities:

* Sequelize connection
* Model loading
* Model associations

---

### modules/

Contains all business features.

Current modules:

```text
auth/
notebook/
notification/
profile/
social/
todo/
user/
```

---

### Module Structure

Example:

```text
user/
├── user.controller.js
├── user.model.js
├── user.routes.js
├── user.schema.js
└── user.service.js
```

#### user.routes.js

Responsible for route registration.

Example:

```js
router.get('/', getUsers);
```

---

#### user.controller.js

Handles request and response lifecycle.

Responsibilities:

* Receive request
* Call service layer
* Return response

Avoid business logic here.

---

#### user.service.js

Contains business logic.

Responsibilities:

* Database operations
* Validations
* Data processing
* External integrations

---

#### user.schema.js

Request validation schemas.

Examples:

* Create User Validation
* Update User Validation
* Query Validation

---

#### user.model.js

Feature-specific Sequelize model definition.

Responsibilities:

* Table structure
* Associations
* Model hooks

---

### routes/

Application route registration.

Example:

```js
src/routes/index.js
```

Responsibilities:

* Register all module routes
* Apply global middleware

---

### shared/

Reusable utilities shared across the application.

#### config/

Application configuration.

Examples:

* Database config
* Environment config
* Third-party credentials

#### constants/

Application constants.

Examples:

```js
ROLE_ADMIN
ROLE_USER
STATUS_ACTIVE
```

#### services/

Shared services used by multiple modules.

Examples:

* Email Service
* SMS Service
* Notification Service

#### utils/

Reusable helper functions.

Examples:

* Pagination
* Response Formatter
* Date Utilities
* File Utilities

---

### templates/

Application templates.

Examples:

* Email templates
* PDF templates

---

### views/

Server-side rendered views if required.

---

### app.js

Express application setup.

Responsibilities:

* Middleware registration
* Security setup
* Route loading

---

### index.js

Application entry point.

Responsibilities:

* Start HTTP server
* Initialize application

---

## Development Guidelines

### Module First Approach

Every new feature should be created inside:

```text
src/modules/
```

Example:

```text
src/modules/student/
```

### Keep Controllers Thin

Good:

```js
const users = await userService.getAllUsers();
```

Bad:

```js
// Database queries directly inside controller
```

### Shared Code Rule

If functionality is used by multiple modules, move it to:

```text
src/shared/
```

Examples:

* Pagination
* Email Sending
* Common Validators
* Utility Functions

---

## Standard API Response

Success Response

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {}
}
```

Error Response

```json
{
  "success": false,
  "message": "Something went wrong",
  "errors": []
}
```

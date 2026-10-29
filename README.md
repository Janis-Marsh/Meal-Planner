# Meal Planner API

## 1. Project Description

The Meal Planner API is a REST API for managing recipes and meal plans. Users can register, log in, and then create, view, update, and delete recipes and meal plans. Reading data is public; any change to data requires a login token.

- **Stage 1:** full CRUD for recipes and meal plans.
- **Stage 2 (this version):** user accounts and login, protected write routes, an owner recorded on every new record, and a list endpoint that supports pagination, sorting, filtering, and search.
- **Stage 3 (planned):** ownership and role enforcement.

## 2. Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript
- dotenv
- bcryptjs (password hashing)
- jsonwebtoken (login tokens)
- Postman (API testing)

## 3. Installation

Clone the repository:

    git clone https://github.com/Janis-Marsh/Meal-Planner

Navigate to the project directory:

    cd Meal-Planner

Install the dependencies:

    npm install

Create your environment file from the template and fill in the values:

    cp .env.example .env

A MongoDB database must be running (local MongoDB or an Atlas connection string).

## 4. Environment Variables

The application reads these from a `.env` file. The real `.env` is never committed; `.env.example` is the template.

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | Port the API runs on (e.g. `3000`) |
| `NODE_ENV` | Yes | Application environment: `development`, `production`, or `test` |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign and verify login tokens. Use a long random string. The server exits on startup if it is missing |
| `JWT_EXPIRES_IN` | No | How long a login token stays valid (e.g. `15m`, `1h`, `7d`). Defaults to `7d` |

Example `.env`:

    PORT=3000
    NODE_ENV=development
    MONGODB_URI=mongodb://localhost:27017/meal_planner
    JWT_SECRET=replace_with_a_long_random_string
    JWT_EXPIRES_IN=7d


## 5. Running the Application

Start the application with:

    npm start

The `start` script runs:

    node src/server.js

The API uses the following base path:

    /api/v1

### Health Check

    GET /health

Expected status: `200 OK`

## 6. Authentication

Protected routes need a token in the `Authorization` header:

    Authorization: Bearer <token>

Get a token by registering or logging in. The response contains the user and a token. Tokens expire after `JWT_EXPIRES_IN`.

| Method | URL | Token needed | Success | Purpose |
|---|---|---|---|---|
| POST | `/api/v1/auth/register` | No | 201 | Create an account; returns the user and a token |
| POST | `/api/v1/auth/login` | No | 200 | Log in; returns the user and a token |
| GET | `/api/v1/auth/me` | Yes | 200 | Get the user the token belongs to |

Notes:

- Register accepts only `name`, `email`, and `password`. Any other field (such as `role`) is ignored, so every new account is an ordinary user.
- Passwords must be at least 8 characters and are stored hashed. The hash is never returned in a response.
- A duplicate email returns `409`.
- A wrong password and an unknown email return the same `401` message, so the API does not reveal which emails have accounts.

Example register request:

    {
        "name": "Jane Cook",
        "email": "jane@example.com",
        "password": "password123"
    }

## 7. API Endpoints

**Read routes (GET) are public. Create, update, and delete routes need a token.**

### Recipes

| Method | URL | Token needed | Purpose | Status |
|---|---|---|---|---|
| GET | `/api/v1/recipes` | No | List recipes (paged, see section 8) | 200 |
| GET | `/api/v1/recipes/:id` | No | Get one recipe | 200 |
| POST | `/api/v1/recipes` | Yes | Create a recipe | 201 |
| PUT | `/api/v1/recipes/:id` | Yes | Update a recipe | 200 |
| PATCH | `/api/v1/recipes/:id` | Yes | Partially update a recipe | 200 |
| DELETE | `/api/v1/recipes/:id` | Yes | Soft delete a recipe | 204 |

Recipe fields: `title` (required, max 60 characters), `category` (required: `breakfast`, `lunch`, `dinner`, `dessert`, `snack`), `description`, `servings` (required, at least 1), `ingredients` (required, at least one), `instructions` (required).

Example recipe request:

    {
        "title": "Chicken Tacos",
        "category": "dinner",
        "description": "Simple chicken tacos",
        "servings": 4,
        "ingredients": [
            "Chicken",
            "Tortillas"
        ],
        "instructions": "Cook chicken and assemble tacos."
    }

### Meal Plans

| Method | URL | Token needed | Purpose | Status |
|---|---|---|---|---|
| GET | `/api/v1/meal-plans` | No | List meal plans (paged, see section 8) | 200 |
| GET | `/api/v1/meal-plans/:id` | No | Get one meal plan | 200 |
| POST | `/api/v1/meal-plans` | Yes | Create a meal plan | 201 |
| PUT | `/api/v1/meal-plans/:id` | Yes | Update a meal plan | 200 |
| PATCH | `/api/v1/meal-plans/:id` | Yes | Partially update a meal plan | 200 |
| DELETE | `/api/v1/meal-plans/:id` | Yes | Soft delete a meal plan | 204 |

Meal plan fields: `title` (required, max 60 characters), `weekStartDate` (required), `meals` (array), `status` (`draft` or `finalized`).

Each meal has `day` (`monday` to `sunday`, lowercase), `mealType` (`breakfast`, `lunch`, `dinner`, `dessert`, `snack`), and an optional `recipeId` (a recipe's `id`).

Example meal plan request:

    {
        "title": "Cutting Week",
        "weekStartDate": "2026-10-05",
        "meals": [
            {
                "recipeId": "<a recipe id>",
                "day": "monday",
                "mealType": "breakfast"
            },
            {
                "recipeId": "<a recipe id>",
                "day": "monday",
                "mealType": "dinner"
            }
        ]
    }

Meal plan rules:

- A plan can have only one meal of each type per day (two Monday dinners returns `400`).
- Only one meal plan can exist per week (a second plan for the same week returns `409`). `weekStartDate` is stored as midnight UTC.
- New plans always start as `draft`, whatever status is sent.
- A `finalized` plan cannot be modified (`409`).

### Health Check

| Method | URL | Purpose | Status |
|---|---|---|---|
| GET | `/health` | Check API health | 200 |

## 8. Query Parameters (List Endpoints)

Both list endpoints (`GET /api/v1/recipes` and `GET /api/v1/meal-plans`) support these.

| Parameter | Applies to | Description |
|---|---|---|
| `page` | Both | Page number. Default `1`. Invalid values fall back to `1` |
| `limit` | Both | Records per page. Default `20`, maximum `100`. Larger values are capped |
| `sort` | Both | Sort field; prefix with `-` for descending (e.g. `-createdAt`). Several fields can be comma separated. A field not on the list returns `400` naming the allowed fields |
| `q` | Both | Case-insensitive text search. Recipes: `title` and `description`. Meal plans: `title` |
| `category` | Recipes | One of `breakfast`, `lunch`, `dinner`, `dessert`, `snack` |
| `ingredient` | Recipes | Case-insensitive partial match against ingredients |
| `servingsMin`, `servingsMax` | Recipes | Range filter on servings |
| `status` | Meal plans | `draft` or `finalized` |
| `day` | Meal plans | `monday` to `sunday` |
| `mealType` | Meal plans | One of `breakfast`, `lunch`, `dinner`, `dessert`, `snack`. Combined with `day`, it matches a single meal that has both |

**Filter fields chosen:**

- Recipes filter on `category` (and a `servings` range).
- Meal plans filter on `status`, `day`, and `mealType`.

**Search fields:** recipes search `title` and `description`; meal plans search `title`.

**Sortable fields:**

- Recipes: `title`, `category`, `servings`, `createdAt`, `updatedAt` (default `-createdAt`).
- Meal plans: `title`, `weekStartDate`, `status`, `createdAt`, `updatedAt` (default `-weekStartDate`).

An invalid filter value (such as `?category=banana`) returns `400` and lists the valid values.

Example:

    GET /api/v1/recipes?category=dinner&q=chicken&sort=-servings&page=1&limit=10

List responses include paging information:

    {
        "success": true,
        "data": [],
        "meta": {
            "page": 1,
            "limit": 20,
            "total": 32,
            "totalPages": 2,
            "hasNextPage": true,
            "hasPrevPage": false
        }
    }

`total` counts the records matching the current filter, not the whole collection.

## 9. Error Responses

Every error goes through one error handler and uses one response shape.

| Status | When |
|---|---|
| 400 | Missing or invalid fields, bad query values, malformed id |
| 401 | Missing, invalid, or expired token; wrong login |
| 404 | Route or record does not exist (soft-deleted records count as not found) |
| 409 | Duplicate email, duplicate meal plan week, or modifying a finalized plan |

## 10. Testing with Postman

A Postman collection and environment are included with the submission.

1. Import the collection (`Collection v2.1`) and the environment into Postman.
2. Select the environment in the top-right dropdown.
3. Check `baseUrl` (default `http://localhost:3000/api/v1`) and the route variables `recipePath` and `mealPlanPath` match your server.
4. Start the API, then run the collection in order with the Runner.

The register and login requests save the token into the environment automatically, so protected requests need no copying and pasting. The collection covers authentication, protected and public routes, owner handling, validation errors, pagination, sorting, filtering, search, and the Stage 1 read/update/delete flow for both resources.

## 11. Architecture

The API uses a layered architecture:

    Routes
       ↓
    Middleware (requireAuth on protected routes)
       ↓
    Controllers
       ↓
    Services
       ↓
    Models
       ↓
    MongoDB

### Routes

Routes define the HTTP methods and URLs for the API. They connect incoming requests to the appropriate controller, and apply `requireAuth` to every route that changes data.

### Middleware

`requireAuth` reads the `Authorization: Bearer <token>` header, verifies the token, loads the user from the database, and attaches the user to `req.user`. Any problem returns `401`.

### Controllers

Controllers receive the request, call the appropriate service, and return the response through the shared response helpers.

### Services

Services contain the database operations and business rules, including writable-field filtering, query building, and the meal plan rules above.

### Models

Models contain the Mongoose schemas that define the structure and validation rules for Users, Recipes, and Meal Plans.

### Utilities

- `utils/jwt.js` signs and verifies tokens; library errors become `401`.
- `utils/queryFeatures.js` handles pagination, sorting, filtering, search, and the `meta` object.
- `utils/validateObjectId.js` rejects malformed ids with `400`.

### Database Configuration

The database configuration manages the connection between the application and MongoDB.

## 12. Security Notes

- Passwords are hashed with bcrypt and never returned.
- Secrets are read from environment variables, never from source code.
- Only named fields are accepted from request bodies, so a client cannot set `ownerId` or `deletedAt` (mass-assignment protection).
- Search text is escaped before it becomes a regular expression.
- The list limit is capped so one request cannot return the whole database.

## 13. Future Development

Stage 2 records who created each recipe and meal plan in the `ownerId` field. At this stage, any logged-in user can still edit or delete any record. That is intended.

Stage 3 will enforce ownership and add authorization for the three roles:

- **Cook** — Manage their own recipes and draft meal plans.
- **Meal Planner** — Manage meal plans.
- **Admin** — Manage users and delete recipes or meal plans.

Ownership and roles can be added as checks in the services and middleware without rebuilding the existing architecture.

## Short Reflection

### 1. Keeping the Password Hash Private

The password hash never appears in a response because it contains sensitive information that should not be shared with users. In my `User` model, `select: false` prevents the password field from being included in query results by default, and the `toJSON()` transform uses `delete ret.password` to remove it before returning user data.

### 2. Limiting the Number of Records

The list endpoint caps the `limit` at 100 to prevent users from requesting too many records at once. Without this cap, large requests could use excessive memory and slow down or crash the server. Other users would likely notice the problem first because their requests might become slow or fail.

### 3. Enforcing Record Ownership

For Stage 3, I would add ownership and role checks to the update controller so regular users can view and change their own records, while an editor can review and finalize the meal plan. The server would compare the record's `ownerId` with the logged-in user's ID and check their role before allowing changes. If a regular user tries to change someone else's record, the server would return a `403 Forbidden` response, while an authorized editor would be allowed to finalize the meal plan.
# Meal Planner API

## 1. Project Description

The Meal Planner API is a REST API for managing recipes and meal plans. Users can create, view, update, and delete recipes and meal plans. The project is designed to support three future roles: Cook, Meal Planner, and Admin.

## 2. Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JavaScript
- dotenv
- Postman

## 3. Installation

Clone the repository:

    git clone https://github.com/Janis-Marsh/Meal-Planner

Navigate to the project directory:

    cd meal-planner

Install the dependencies:

    npm install

Create a `.env` file using `.env.example` as a template.

## 4. Environment Variables

The application requires the following environment variables:

| Variable | Description |
|---|---|
| `PORT` | Port the API runs on |
| `MONGO_URI` | MongoDB connection string |

Example:

    PORT=3000
    MONGO_URI=your_mongodb_connection_string

## 5. Running the Application

Start the application with:

    npm start

The `start` script runs:

    node src/server.js

The API uses the following base path:

    /api/v1

### Health Check

    GET /api/v1/health

Expected status: `200 OK`

## 6. API Endpoints

### Recipes

| Method | URL | Purpose | Request Body | Status |
|---|---|---|---|---|
| GET | `/api/v1/recipes` | Get all recipes | None | 200 |
| GET | `/api/v1/recipes/:id` | Get one recipe | None | 200 |
| POST | `/api/v1/recipes` | Create a recipe | Recipe data | 201 |
| PUT | `/api/v1/recipes/:id` | Replace a recipe | Recipe data | 200 |
| PATCH | `/api/v1/recipes/:id` | Partially update a recipe | Recipe fields | 200 |
| DELETE | `/api/v1/recipes/:id` | Soft delete a recipe | None | 204 |

### Example Recipe Request

    {
        "title": "Chicken Tacos",
        "description": "Simple chicken tacos",
        "servings": 4,
        "ingredients": [
            "Chicken",
            "Tortillas"
        ],
        "instructions": "Cook chicken and assemble tacos."
    }

### Meal Plans

| Method | URL | Purpose | Request Body | Status |
|---|---|---|---|---|
| GET | `/api/v1/mealPlans` | Get all meal plans | None | 200 |
| GET | `/api/v1/mealPlans/:id` | Get one meal plan | None | 200 |
| POST | `/api/v1/mealPlans` | Create a meal plan | Meal plan data | 201 |
| PUT | `/api/v1/mealPlans/:id` | Replace a meal plan | Meal plan data | 200 |
| PATCH | `/api/v1/mealPlans/:id` | Partially update a meal plan | Meal plan fields | 200 |
| DELETE | `/api/v1/mealPlans/:id` | Soft delete a meal plan | None | 204 |

### Example Meal Plan Request

    {
        "weekStartDate": "2026-10-05",
        "meals": [
            {
                "recipeId": 1,
                "day": "Monday",
                "mealType": "breakfast"
            },
            {
                "recipeId": 2,
                "day": "Monday",
                "mealType": "dinner"
            }
        ]
    }

### Health Check

| Method | URL | Purpose | Status |
|---|---|---|---|
| GET | `/api/v1/health` | Check API health | 200 |

## 7. Architecture

The API uses a layered architecture:

    Routes
       ↓
    Controllers
       ↓
    Services
       ↓
    Models
       ↓
    MongoDB

### Routes

Routes define the HTTP methods and URLs for the API. They connect incoming requests to the appropriate controller.

### Controllers

Controllers receive the request, call the appropriate service, and return the response to the client.

### Services

Services contain the database operations and business rules for the application.

### Models

Models contain the Mongoose schemas that define the structure and validation rules for Recipes and Meal Plans.

### Database Configuration

The database configuration manages the connection between the application and MongoDB.

## 8. Future Development

Stage 2 will add authentication using the existing `createdBy` ownership fields.

Stage 3 will add authorization for the three roles:

- **Cook** — Manage their own recipes and draft meal plans.
- **Meal Planner** — Manage meal plans.
- **Admin** — Manage users and delete recipes or meal plans.

Authentication and authorization can be added as middleware without rebuilding the existing service and database architecture.
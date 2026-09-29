# Meal Planner

## Project Overview

The Meal Planner will be a REST API for creating and organizing weekly meal plans. Cooks can create recipes and use them to build draft meal plans, while Meal Planners can review and finalize the plans.

The project will have three roles:

- Cook
- Meal Planner
- Admin

## Resources

### Recipe

The primary resource will be `Recipe`. A recipe will include:

- `title`
- `description`
- `servings`
- `ingredients`
- `instructions`
- `createdBy`

The `createdBy` field will identify the user who created the recipe.

### MealPlan

The second resource will be `MealPlan`. A meal plan will include:

- `weekStartDate`
- `meals`
- `status`
- `createdBy`

Each meal will reference a recipe and include a meal type such as:

- Breakfast
- Lunch
- Dinner
- Snack

Meal plans can have one of two statuses:

- `draft`
- `finalized`

## Roles & Authorization

### Cook

Cooks can:

- Create their own recipes.
- Manage their own recipes.
- Create draft meal plans.
- Manage draft meal plans they own.

Cooks can only modify recipes and draft meal plans that they own.

### Meal Planner

Meal Planners can:

- Manage meal plans.
- Review draft meal plans.
- Make changes to draft meal plans.
- Finalize meal plans.

Finalizing a meal plan is an exclusive action of the Meal Planner. The Admin cannot finalize a meal plan because this action is specifically assigned to the Meal Planner role.

### Admin

Admins can:

- Manage users.
- Delete any recipe.
- Delete any meal plan.
- Manage user accounts.

## Rules & Validation

Recipes will require basic information such as:

- Title
- Servings
- Ingredients
- Instructions

Meal plans can be edited while they are in the `draft` state.

Once a meal plan is finalized, a Cook cannot modify it.

Recipes and meal plans will have an owner through the `createdBy` field.

## Project Requirements

### Primary Resource with Full CRUD

`Recipe` will have full Create, Read, Update, and Delete operations.

### Clear Ownership

Recipes and meal plans will have a `createdBy` field that connects each resource to the user who created it.

### Three Distinct Roles

The API will have three roles with different responsibilities and permissions:

- Cook
- Meal Planner
- Admin

### Middle-Role Exclusive Action

Only the Meal Planner can finalize a meal plan. The Admin cannot perform this action.

### Destructive Admin Action

The Admin can delete any recipe or meal plan and manage user accounts.

## Project Entities

The project will use three main entities:

1. `User`
2. `Recipe`
3. `MealPlan`

Keeping the project to these three entities provides enough functionality to demonstrate CRUD, ownership, authentication, and authorization while keeping the overall project manageable.
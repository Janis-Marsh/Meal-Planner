# Meal Planner

The Meal Planner will be a REST API for creating and organizing weekly meal plans. Cooks can create recipes and use them to build draft meal plans, while Meal Planners can review and finalize the plans. 

## Entities

| Entity | Important Fields | Owned By |
| --- | --- | --- |
| Recipe | title, description, servings, ingredients, instructions, and the user who created it. |  |
| MealPlan | week start date, meals, status, and the user who created it. |  |

## Roles

| Role | Name in My Project | Responsibilities |
| --- | --- | --- |
| MEMBER | Cook |  Can create and manage their own recipes and draft meal plans. |
| STEWARD | Meal Planner | Can manage meal plans and finalize them. |
| ADMIN | Admin | Manages users and can delete any recipe or meal plan. |

## Required Design Rules

### R1 CRUD Resource

Users will be able to create, read, update, and delete recipes and meal plan drafts they own

### R2 Ownership

Recipes and meal plans will have a createdBy field that connects them to the user who created them. 

### R3 Three Roles

Cook: Can create and manage their own recipes and draft meal plans. 
Meal Planner: Can manage meal plans and finalize them. The Meal Planner reviews the draft meal plan and can make changes before finalizing it. 
Admin: Manages users and can delete any recipe or meal plan. Recipes and meal plans will have an owner. Cooks can only modify recipes and draft meal plans they own. 


### R4 STEWARD-Only Action

The Meal Planner's exclusive action is finalizing a meal plan. The Admin cannot perform this action because it is specifically the Meal Planner's responsibility. 

### R5 ADMIN-Only Action

Admin can delete any recipe or meal plan

## Technology Decisions

## Risk
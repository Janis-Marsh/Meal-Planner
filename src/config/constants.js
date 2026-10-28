'use strict'

/** Days a meal can be planned for */
const MEALDAY = Object.freeze([
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
])

const MEALTYPE = Object.freeze([
    'breakfast', 'lunch', 'dinner', 'dessert', 'snack'
])

const MEALPLAN_STATUS = Object.freeze({
    DRAFT: 'draft', FINALIZED: 'finalized'
})
const MEALPLAN_STATUSES = Object.freeze(Object.values(MEALPLAN_STATUS))

/** Sorting whitelists: fields a client may sort by, per resource */
const MEALPLAN_SORTABLE_FIELDS = Object.freeze([
    'title', 'weekStartDate', 'status', 'createdAt', 'updatedAt'
])
const MEALPLAN_DEFAULT_SORT = Object.freeze({weekStartDate: -1})

const RECIPE_CATEGORY = Object.freeze([
    'breakfast', 'lunch', 'dinner', 'dessert', 'snack'
])

const RECIPE_SORTABLE_FIELDS = Object.freeze([
    'title', 'category', 'servings', 'createdAt', 'updatedAt'
])
const RECIPE_DEFAULT_SORT = Object.freeze({createdAt: -1})

/** Generic fallback used by parseSort when a resource doesn't pass its own list */
const SORTABLE_FIELDS = Object.freeze(['createdAt', 'updatedAt'])
const DEFAULT_SORT = Object.freeze({createdAt: -1})

const PAGINATION = Object.freeze({
    DEFAULT_PAGE: 1, DEFAULT_LIMIT: 20, MAX_LIMIT: 100
})

const API_PREFIX = '/api/v1'

/** Stage 2: account roles
 * At this point we are only recording who is making the request
 */
const ROLES = Object.freeze({USER: 'user', EDITOR: 'editor', ADMIN: 'admin'})
const ROLE_VALUES = Object.freeze(Object.values(ROLES))

/** Stage 2: Authentication */
const AUTH = Object.freeze({
    SALT_ROUNDS: 10,
    DEFAULT_JWT_EXPIRES_IN: '7d',
    BEARER_PREFIX: 'Bearer '
})

module.exports = {
    MEALDAY, MEALTYPE, MEALPLAN_STATUS, MEALPLAN_STATUSES,
    MEALPLAN_SORTABLE_FIELDS, MEALPLAN_DEFAULT_SORT, RECIPE_CATEGORY,
    RECIPE_SORTABLE_FIELDS, RECIPE_DEFAULT_SORT,
    SORTABLE_FIELDS, DEFAULT_SORT, PAGINATION, API_PREFIX,
    // Stage 2:
    ROLES, ROLE_VALUES, AUTH
}
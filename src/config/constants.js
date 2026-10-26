
/** rooms a plant can live in*/
const MEALDAY = Object.freeze([
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
])

const MEALTYPE = Object.freeze([
    'breakfast', 'lunch', 'dinner', 'dessert', 'snack'
])

/** Life Cycles */
const MEALPLAN_STATUS = Object.freeze({
    DRAFT: 'draft', FINALIZED: 'finalized'
})
const MEALPLAN_STATUSES = Object.freeze(Object.values(MEALPLAN_STATUS))

//** Client Tags for Sorting*/
const SORTABLE_FIELDS = Object.freeze([
    'createdAt', 'updatedAt'
])

const PAGINATION = Object.freeze({
    DEFAULT_PAGE: 1, DEFAULT_LIMIT: 20, MAX_LIMIT: 100
})

const API_PREFIX = '/api/v1'

/** stage 2: account roles
 * At this point we are only making sure who is making the request know what they are allowed to touch
 */
const ROLES = Object.freeze({USER: 'user', EDITOR: 'editor', ADMIN: 'admin'})
const ROLE_VALUES = Object.freeze(Object.values(ROLES))

/**
 * Stage 2: Authentication
 */
const AUTH = Object.freeze({
    SALT_ROUNDS: 10,
    // when using the term salting refers to how complex the encryption will be, but it also plays a role
    // in how it will take the decrypt/reencrypt info on the fly which means the most crazy security
    // is not the best for application performance. Anything over 15 salt rounds is too much and will start affecting application performance
    DEFAULT_JWT_EXPIRES_IN: '7d',
    BEARER_PREFIX: 'Bearer'
})

const DEFAULT_SORT = Object.freeze({createdAt: -1})

module.exports = {MEALDAY, MEALTYPE, MEALPLAN_STATUS, MEALPLAN_STATUSES, SORTABLE_FIELDS, PAGINATION, API_PREFIX,
    // Stage 2:
    ROLES, ROLE_VALUES, AUTH, DEFAULT_SORT
}
'use strict'

const { PAGINATION, SORTABLE_FIELDS, DEFAULT_SORT,  MEALPLAN_STATUSES, MEALDAY, MEALTYPE, RECIPE_CATEGORY } = require('../config/constants')
const ApiError = require('./ApiError')

function parsePagination(query = {}) {
    const rawPage = Number.parseInt(query.page, 10)
    const rawLimit = Number.parseInt(query.limit, 10)

    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : PAGINATION.DEFAULT_PAGE
    let limit = Number.isInteger(rawLimit) && rawLimit > 0 ? rawLimit : PAGINATION.DEFAULT_LIMIT
    if (limit > PAGINATION.MAX_LIMIT) limit = PAGINATION.MAX_LIMIT

    return { page, limit, skip: (page - 1) * limit }
}

/**
 * @throws {ApiError} 400 when a field is not sortable
 */
function parseSort(sortParam, allowedFields = SORTABLE_FIELDS, defaultSort = DEFAULT_SORT) {
    if (!sortParam || typeof sortParam !== 'string') return { ...defaultSort }

    const sort = {}

    for (const rawField of sortParam.split(',')) {
        const field = rawField.trim()
        if (!field) continue

        const descending = field.startsWith('-')
        const name = descending ? field.slice(1) : field

        if (!allowedFields.includes(name)) {
            throw ApiError.badRequest(`Cannot sort by '${name}'. Sortable fields: ${allowedFields.join(', ')}`)
        }
        sort[name] = descending ? -1 : 1
    }

    if (Object.keys(sort).length === 0) return { ...defaultSort }

    if (!('_id' in sort)) sort._id = 1

    return sort
}

function buildMeta({ page, limit, total }) {
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 0

    return {
        page, limit, total, totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
    }
}

function escapeRegex(text) {
    return String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function parseNumber(value, name) {
    const number = Number(value)
    if (value === '' || !Number.isFinite(number)) {
        throw ApiError.badRequest(`${name} must be a number`)
    }
    return number
}

/**
 *
 * @throws {ApiError} 400 on a value that is not in the allowed set
 */
function buildMealFilter(query = {}) {
    const filter = {}

    if (query.status) {
        if (!MEALPLAN_STATUSES.includes(query.status)) {
            throw ApiError.badRequest(`'${query.status}' is not a valid status. Valid: ${MEALPLAN_STATUSES.join(', ')}`)
        }
        filter.status = query.status
    }

    const mealMatch = {}

    if (query.day) {
        if (!MEALDAY.includes(query.day)) {
            throw ApiError.badRequest(`'${query.day}' is not a valid day. Valid: ${MEALDAY.join(', ')}`)
        }
        mealMatch.day = query.day
    }

    if (query.mealType) {
        if (!MEALTYPE.includes(query.mealType)) {
            throw ApiError.badRequest(`'${query.mealType}' is not a valid meal type. Valid: ${MEALTYPE.join(', ')}`)
        }
        mealMatch.mealType = query.mealType
    }

    if (Object.keys(mealMatch).length > 0) {
        filter.meals = { $elemMatch: mealMatch }
    }

    if (query.q) {
        filter.title = new RegExp(escapeRegex(String(query.q).trim()), 'i')
    }

    return filter
}

/**
 *
 * @throws {ApiError} 400 on an invalid category or a non-numeric servings value
 */

function buildRecipeFilter(query = {}) {
    const filter = {}

    if (query.category) {
        if (!RECIPE_CATEGORY.includes(query.category)) {
            throw ApiError.badRequest(`'${query.category}' is not a valid category. Valid: ${RECIPE_CATEGORY.join(', ')}`)
        }
        filter.category = query.category
    }

    if (query.q) {
        const pattern = new RegExp(escapeRegex(String(query.q).trim()), 'i')
        filter.$or = [{ title: pattern }, { description: pattern }]
    }

    if (query.ingredient) {
        filter.ingredients = new RegExp(escapeRegex(String(query.ingredient).trim()), 'i')
    }

    if (query.servingsMin !== undefined || query.servingsMax !== undefined) {
        filter.servings = {}
        if (query.servingsMin !== undefined) filter.servings.$gte = parseNumber(query.servingsMin, 'servingsMin')
        if (query.servingsMax !== undefined) filter.servings.$lte = parseNumber(query.servingsMax, 'servingsMax')
    }

    return filter
}

module.exports = { parsePagination, parseSort, buildMeta, buildMealFilter, buildRecipeFilter, escapeRegex }
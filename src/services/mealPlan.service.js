'use strict'

const MealPlan = require('../models/mealPlan.model')
const ApiError = require('../utils/ApiError')
const {parsePagination, parseSort, buildMeta, buildMealFilter} = require('../utils/queryFeatures')
const { MEALPLAN_STATUS, MEALPLAN_SORTABLE_FIELDS, MEALPLAN_DEFAULT_SORT } = require('../config/constants')
const VALID_ID = /^[0-9a-fA-F]{24}$/

// Stage 2: ownerId and deletedAt are not writable (mass assignment protection)
const WRITABLE_FIELDS = ['title', 'weekStartDate', 'meals', 'status']

const pickWritableFields = (body = {}) => {
    const payload = {}
    for (const field of WRITABLE_FIELDS) {
        if (body[field] !== undefined) payload[field] = body[field]
    }
    return payload
}

const normalizeWeekStart = (value) => {
    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        throw ApiError.badRequest('weekStartDate must be a valid date')
    }

    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

const validateMeals = (meals) => {
    if (meals === undefined || meals === null) return

    if (!Array.isArray(meals)) {
        throw ApiError.badRequest('meals must be an array')
    }

    const seen = new Set()

    for (const meal of meals) {
        if (!meal || typeof meal !== 'object') {
            throw ApiError.badRequest('each meal must be an object with a day and mealType')
        }

        const key = `${meal.day}-${meal.mealType}`

        if (seen.has(key)) {
            throw ApiError.badRequest(`A meal plan can only have one ${meal.mealType} meal on ${meal.day}`)
        }

        seen.add(key)
    }
}

const ensureWeekIsFree = async (weekStartDate, excludeId) => {
    const query = { weekStartDate, deletedAt: null }
    if (excludeId) query._id = { $ne: excludeId }

    if (await MealPlan.exists(query)) {
        throw ApiError.conflict('A meal plan already exists for this week')
    }
}

const assertValidId = (value, name = 'id') => {
    if (!mongoose.isObjectIdOrHexString(value)) {
        throw ApiError.badRequest(`${name} must be a valid id`)
    }
}

const findActive = async (id) => {
    assertValidId(id)
    const mealPlan = await MealPlan.findOne({ _id: id, deletedAt: null })
    if (!mealPlan) throw ApiError.notFound('Meal plan not found')
    return mealPlan
}

const create = async (body, ownerId) => {
    const data = pickWritableFields(body)

    if (data.weekStartDate === undefined) {
        throw ApiError.badRequest('weekStartDate is required')
    }

    data.weekStartDate = normalizeWeekStart(data.weekStartDate)

    validateMeals(data.meals)
    await ensureWeekIsFree(data.weekStartDate)

    return MealPlan.create({ ...data, ownerId, status: MEALPLAN_STATUS.DRAFT })
}

const findAll = async (query = {}) => {
    const filter = { ...buildMealFilter(query), deletedAt: null }
    const sort = parseSort(query.sort, MEALPLAN_SORTABLE_FIELDS, MEALPLAN_DEFAULT_SORT)
    const { page, limit, skip } = parsePagination(query)

    const [data, total] = await Promise.all([
        MealPlan.find(filter).sort(sort).skip(skip).limit(limit),
        MealPlan.countDocuments(filter)
    ])

    return { data, meta: buildMeta({ page, limit, total }) }
}

const findById = (id) => findActive(id)

const update = async (id, body) => {
    const mealPlan = await findActive(id)

    if (mealPlan.status === MEALPLAN_STATUS.FINALIZED) {
        throw ApiError.conflict('A finalized meal plan cannot be modified')
    }

    const data = pickWritableFields(body)

    validateMeals(data.meals)

    if (data.weekStartDate !== undefined) {
        data.weekStartDate = normalizeWeekStart(data.weekStartDate)
        await ensureWeekIsFree(data.weekStartDate, mealPlan._id)
    }

    Object.assign(mealPlan, data)

    return mealPlan.save()
}

const remove = async (id) => {
    const mealPlan = await findActive(id)
    mealPlan.deletedAt = new Date()
    await mealPlan.save()
    return mealPlan
}

module.exports = { create, findAll, findById, update, remove }
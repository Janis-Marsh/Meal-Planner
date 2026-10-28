'use strict'

const Recipe = require('../models/recipe.model')
const ApiError = require('../utils/ApiError')
const {parsePagination, parseSort, buildMeta, buildRecipeFilter} = require('../utils/queryFeatures')
const {RECIPE_SORTABLE_FIELDS, RECIPE_DEFAULT_SORT} = require('../config/constants')

// Stage 2: ownerId and deletedAt are not writable (mass assignment protection)
const WRITABLE_FIELDS = ['title', 'category', 'description', 'servings', 'ingredients', 'instructions']

const pickWritableFields = (body = {}) => {
    const payload = {}
    for (const field of WRITABLE_FIELDS) {
        if (body[field] !== undefined) payload[field] = body[field]
    }
    return payload
}

const assertValidId = (value, name = 'id') => {
    if (!mongoose.isObjectIdOrHexString(value)) {
        throw ApiError.badRequest(`${name} must be a valid id`)
    }
}

const findActive = async (id) => {
    assertValidId(id)
    const recipe = await Recipe.findOne({ _id: id, deletedAt: null })
    if (!recipe) throw ApiError.notFound('Recipe not found')
    return recipe
}

const create = async (body, ownerId) => {
    return Recipe.create({ ...pickWritableFields(body), ownerId })
}

const findAll = async (query = {}) => {

    const filter = { ...buildRecipeFilter(query), deletedAt: null }
    const sort = parseSort(query.sort, RECIPE_SORTABLE_FIELDS, RECIPE_DEFAULT_SORT)
    const { page, limit, skip } = parsePagination(query)

    const [data, total] = await Promise.all([
        Recipe.find(filter).sort(sort).skip(skip).limit(limit),
        Recipe.countDocuments(filter)
    ])

    return { data, meta: buildMeta({ page, limit, total }) }
}

const findById = (id) => findActive(id)

const update = async (id, body) => {
    const recipe = await findActive(id)

    Object.assign(recipe, pickWritableFields(body))

    return recipe.save()
}

const remove = async (id) => {
    const recipe = await findActive(id)
    recipe.deletedAt = new Date()
    await recipe.save()
    return recipe
}

module.exports = { create, findAll, findById, update, remove }
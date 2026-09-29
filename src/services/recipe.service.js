const Recipe = require('../models/recipe.model')
const ApiError = require('../utils/ApiError')

const create = async (data) => {
    
    const lastRecipe = await Recipe.findOne().sort({ _id: -1 })

    const nextId = lastRecipe ? lastRecipe._id + 1 : 1

    const recipe = await Recipe.create({
        ...data,
        _id: nextId,
        createdBy: data.createdBy ?? null
    })

    return recipe
}

const findAll = async () => {
    return await Recipe.find({
        deletedAt: null
    })
}

const findById = async (id) => {
    const numericId = Number(id)

    if (!Number.isInteger(numericId) || numericId <= 0) {
        throw new ApiError(400, 'Recipe ID must be a positive number')
    }

    const recipe = await Recipe.findById(numericId)

    if (!recipe) {
        throw new ApiError(404, 'Recipe not found')
    }

    return recipe
}

const update = async (id, data) => {
    const recipe = await Recipe.findById(id)

    if (!recipe) {
        throw new ApiError(404, 'Recipe not found')
    }

    delete data.createdBy

    Object.assign(recipe, data)

    return await recipe.save()
}

const remove = async (id) => {
    const recipe = await Recipe.findById(id)

    if (!recipe || recipe.deletedAt) {
        throw new ApiError(404, 'Recipe not found')
    }

    recipe.deletedAt = new Date()

    await recipe.save()

    return recipe
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
}
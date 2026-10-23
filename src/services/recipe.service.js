const Recipe = require('../models/recipe.model')
const ApiError = require('../utils/ApiError')

const create = async (data) => {
    const recipe = await Recipe.create({
        ...data,
    })

    return recipe
}

const findAll = async () => {
    return await Recipe.find({
        deletedAt: null
    })
}

const findById = async (id) => {

    const recipe = await Recipe.findById(req.params.id)

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
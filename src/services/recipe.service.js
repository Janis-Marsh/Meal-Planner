const Recipe = require('../models/recipe.model')
const ApiError = require('../utils/ApiError')

const create = async (data) => {
    const lastRecipe = await Recipe.findOne().sort({ _id: -1 })

    const nextId = lastRecipe ? lastRecipe._id + 1 : 1

    return await Recipe.create({
        ...data,
        _id: nextId,
        createdBy: null
    })
}

const findAll = async () => {
    return await Recipe.find()
}

const findById = async (id) => {
    const recipe = await Recipe.findById(id)

    if (!recipe) {
        throw new ApiError(404, 'Recipe not found')
    }

    return recipe
}

const update = async (id, data) => {
    const recipe = await Recipe.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    )

    if (!recipe) {
        throw new ApiError(404, 'Recipe not found')
    }

    return recipe
}

const remove = async (id) => {
    const recipe = await Recipe.findByIdAndDelete(id)

    if (!recipe) {
        throw new ApiError(404, 'Recipe not found')
    }

    return recipe
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
}
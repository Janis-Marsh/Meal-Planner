const Recipe = require("../models/recipe.model")

const create = async (recipeData) => {
    return await Recipe.create(recipeData)
}

const findAll = async () => {
    return await Recipe.find({})
}

const findById = async (id) => {
    const recipe = await Recipe.findById(id)

    if (!recipe) {
        throw new Error('Recipe not found');
    }

    return recipe
}

const update = async (id, updateData) => {
    const recipe = await Recipe.findById(id)

    if (!recipe) {
        throw new Error('Recipe not found');
    }

    Object.assign(recipe, updateData)

    await recipe.save()

    return recipe
}

const remove = async (id) => {
    const deletedRecipe = await Recipe.findByIdAndDelete(id)

    if (!deletedRecipe) {
        throw new Error('Recipe not found');
    }

    return deletedRecipe;
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
}
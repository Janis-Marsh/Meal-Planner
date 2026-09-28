const recipeService = require('../services/recipe.service')

const create = async (req, res) => {
    const recipe = await recipeService.create(req.body)

    res.status(201).json({
        success: true,
        data: recipe
    })
}

const findAll = async (_req, res) => {
    const recipes = await recipeService.findAll()

    res.status(200).json({
        success: true,
        data: recipes
    })
}

const findById = async (req, res) => {
    const recipe = await recipeService.findById(req.params.id)

    res.status(200).json({
        success: true,
        data: recipe
    })
}

const update = async (req, res) => {
    const recipe = await recipeService.update(
        req.params.id,
        req.body
    )

    res.status(200).json({
        success: true,
        data: recipe
    })
}

const remove = async (req, res) => {
    await recipeService.remove(req.params.id)

    res.status(204).send()
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
}
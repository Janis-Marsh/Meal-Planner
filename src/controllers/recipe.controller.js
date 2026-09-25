const recipeService = require("../services/recipe.service")

const createRecipe = async (req, res) => {
    const recipe = await recipeService.create(req.body)
    
    res.status(201).json({
        success: true,
        data: recipe
    })
}

const getRecipes = async (req, res) => {
    const recipes = await recipeService.findAll()

    res.status(200).json({
        success: true,
        data: recipes
    })
}

const getRecipe = async (req, res) => {
    const recipe = await recipeService.findById(req.params.id)

    if (!recipe) {
        return res.status(404).json({
            success: false,
            error: {
                message: 'Recipe not found'
            }
        })
    }

    res.status(200).json({
        success: true,
        data: recipes
    })
}

const updateRecipe = async (req, res) => {
    const recipe = await recipeService.update(
        req.params.id,
        req.body
    )

    if (!recipe) {
        return res.status(404).json({
            success: false,
            error: {
                message: 'Recipe not found'
            }
        })
    }

    res.status(200).json({
        success: true,
        data: recipe
    })
}

const deleteRecipe = async (req, res) => {
    const recipe = await recipeService.remove(req.params.id)

    if (!recipe) {
        return res.status(404).json({
            success: false,
            error: {
                message: 'Recipe not found'
            }
        })
    }

    res.status(204).send()
}

module.exports = {
    createRecipe,
    getRecipes,
    getRecipe,
    updateRecipe,
    deleteRecipe
}
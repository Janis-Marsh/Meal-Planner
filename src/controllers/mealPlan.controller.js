const mealPlanService = require("../services/mealPlan.service")

const createMealPlan = async (req, res) => {
    const mealPlan = await mealPlanService.create(req.body)
    
    res.status(201).json({
        success: true,
        data: mealPlan
    })
}

const getMealPlans = async (req, res) => {
    const mealPlans = await mealPlanService.findAll()

    res.status(200).json({
        success: true,
        data: mealPlans
    })
}

const getMealPlan = async (req, res) => {
    const mealPlan = await mealPlanService.findById(req.params.id)

    if (!mealPlan) {
        return res.status(404).json({
            success: false,
            error: {
                message: 'Meal Plan not found'
            }
        })
    }

    res.status(200).json({
        success: true,
        data: mealPlans
    })
}

const updateMealPlan = async (req, res) => {
    const mealPlan = await mealPlanService.update(
        req.params.id,
        req.body
    )

    if (!mealPlan) {
        return res.status(404).json({
            success: false,
            error: {
                message: 'Meal Plan not found'
            }
        })
    }

    res.status(200).json({
        success: true,
        data: mealPlan
    })
}

const deleteMealPlan = async (req, res) => {
    const mealPlan = await mealPlanService.remove(req.params.id)

    if (!mealPlan) {
        return res.status(404).json({
            success: false,
            error: {
                message: 'Meal Plan not found'
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
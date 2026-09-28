const express = require('express')

const mealPlanRoutes = require('./mealPlan.routes')
const recipeRoutes = require('./recipe.routes')

const router = express.Router()

router.use('/meal-plans', mealPlanRoutes)
router.use('/recipes', recipeRoutes)

module.exports = router
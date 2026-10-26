const express = require('express')
const mealPlanController = require('../controllers/mealPlan.controller')
const {requireAuth} = require('../middleware/auth')

const router = express.Router()

router
    .route('/')
        .get(mealPlanController.findAll)
        .post(requireAuth, mealPlanController.create)

router
    .route('/:id')
        .get(mealPlanController.findById)
        .put(mealPlanController.update)
        .patch(mealPlanController.update)
        .delete(mealPlanController.remove)

module.exports = router
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
        .put(requireAuth, mealPlanController.update)
        .patch(requireAuth, mealPlanController.update)
        .delete(requireAuth, mealPlanController.remove)

module.exports = router
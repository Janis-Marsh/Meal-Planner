const express = require('express')
const mealPlanController = require('../controllers/mealPlan.controller')
const asyncHandler = require('../utils/asyncHandler')
const {requireAuth} = require('../middleware/auth')

const router = express.Router()

router
    .route('/')
        .get(asyncHandler(mealPlanController.findAll))
        .post(requireAuth, asyncHandler(mealPlanController.create))

router
    .route('/:id')
        .get(asyncHandler(mealPlanController.findById))
        .put(asyncHandler(mealPlanController.update))
        .patch(asyncHandler(mealPlanController.update))
        .delete(asyncHandler(mealPlanController.remove))

module.exports = router
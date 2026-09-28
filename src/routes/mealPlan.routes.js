const express = require('express')
const mealPlanController = require('../controllers/mealPlan.controller')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get('/', asyncHandler(mealPlanController.findAll))

router.get('/:id', asyncHandler(mealPlanController.findById))

router.post('/', asyncHandler(mealPlanController.create))

router.put('/:id', asyncHandler(mealPlanController.update))

router.patch('/:id', asyncHandler(mealPlanController.update))

router.delete('/:id', asyncHandler(mealPlanController.remove))

module.exports = router
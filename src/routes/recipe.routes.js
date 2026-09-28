const express = require('express')
const recipeController = require('../controllers/recipe.controller')
const asyncHandler = require('../utils/asyncHandler')

const router = express.Router()

router.get('/', asyncHandler(recipeController.findAll))

router.get('/:id',asyncHandler( recipeController.findById))

router.post('/', asyncHandler(recipeController.create))

router.put('/:id', asyncHandler(recipeController.update))

router.patch('/:id', asyncHandler(recipeController.update))

router.delete('/:id', asyncHandler(recipeController.remove))

module.exports = router
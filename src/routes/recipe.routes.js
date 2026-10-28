const express = require('express')
const recipeController = require('../controllers/recipe.controller')
const asyncHandler = require('../utils/asyncHandler')
const {requireAuth} = require('../middleware/auth')

const router = express.Router()

router
    .route('/')
        .get(recipeController.findAll)
        .post(requireAuth, recipeController.create)

router
    .route('/:id')
        .get(recipeController.findById)
        .put(requireAuth, recipeController.update)
        .patch(requireAuth, recipeController.update)
        .delete(requireAuth, recipeController.remove)

module.exports = router
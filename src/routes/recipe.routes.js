const express = require('express')
const recipeController = require('../controllers/recipe.controller')
const asyncHandler = require('../utils/asyncHandler')
const {requireAuth} = require('../middleware/auth')

const router = express.Router()

router
    .route('/')
        .get(asyncHandler(recipeController.findAll))
        .post(requireAuth, asyncHandler(recipeController.create))

router
    .route('/:id')
        .get(asyncHandler(recipeController.findById))
        .put(asyncHandler(recipeController.update))
        .patch(asyncHandler(recipeController.update))
        .delete(asyncHandler(recipeController.remove))

module.exports = router
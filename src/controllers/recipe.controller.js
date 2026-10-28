'use strict'

const asyncHandler = require('../utils/asyncHandler')
const { sendSuccess, sendCreate, sendNoContent } = require('../utils/apiResponse')
const recipeService = require('../services/recipe.service')

const findAll = asyncHandler(async (req, res) => {
    const { data, meta } = await recipeService.findAll(req.query)
    sendSuccess(res, data, 200, { meta })
})

const create = asyncHandler(async (req, res) => {
    sendCreate(res, await recipeService.create(req.body, req.user._id))
})

const findById = asyncHandler(async (req, res) => {
    sendSuccess(res, await recipeService.findById(req.params.id))
})

const update = asyncHandler(async (req, res) => {
    sendSuccess(res, await recipeService.update(req.params.id, req.body))
})

const remove = asyncHandler(async (req, res) => {
    await recipeService.remove(req.params.id)
    sendNoContent(res)
})

module.exports = { findAll, findById, create, update, remove }
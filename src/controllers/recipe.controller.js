'use strict'

const asyncHandler = require('../utils/asyncHandler')
const {sendSuccess, sendCreate, sendNoContent} = require('../utils/apiResponse')
const Recipe = require('../models/recipe.model.js')
const ApiError = require('../utils/ApiError')
// Stage 2:
const {parsePagination, parseSort, buildMeta, buildRecipeFilter} = require('../utils/queryFeatures.js')

const WRITABLE_FIELDS = ['title', 'description', 'servings', 'ingredients', 'instructions']
// notice that ownerId was not included and should not be allow the user to change the field

function pickWritableFields(body={}){
    const payload = {}
    for (const field of WRITABLE_FIELDS){
        if(body[field] !== undefined) payload[field] = body[field]
    }
    return payload
}

// GET /api/v1/recipe
const findAll = asyncHandler(async (req, res) => {
    /** Stage 2: pagination, features; sorting, filtering
     * 
     * each helper function should throw a 400 ApiError on bad inputs and the asyncHandler wil forward ut to the errorHandler so this handles all forms of error 
     * */ 
    const filter = buildRecipeFilter(req.query)
    const sort = parseSort(req.query.sort)
    const {page, limit, skip} = parsePagination(req.query)
    
        /**2 queries eun together rather than one after the other the page of records and the total number of matches the client needs to know how many pages will exist. countDocuments uses the same filter so the count describes the filtered set, not the whole collection */
    const [recipe, total] = await Promise.all([
        Recipe.find(filter).sort(sort).skip(skip).limit(limit),
        Recipe.countDocuments(filter)
    ])
        /** the meta data will fo along with the sendSuccess extra argument so the response will be
         * {success, data, meta} and the single
         */
    sendSuccess(res, recipe, 200, {meta: buildMeta({page, limit, total})})
})

// POST /api/v1/recipe/
const create = asyncHandler(async (req, res) => {
    /**this is the line that plant.model.js is waiting for
     * requireAuth guarantees req.user exists so the new record is going to be stamped with the id of whoever is logged in. ownerId is set from the token, never from the body, which is why the pickWritableFields filters the body first
     */
    const recipe = await Recipe.create({
        ...pickWritableFields(req.body),
        ownerId: req.user._id
        // using the mongodb is -- _id
    })
    sendCreate(res, recipe)
})

// GET /api/v1/recipe/:id
const findById = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findById(req.params.id)
    if (!recipe) throw new ApiError.notFound('Recipe not found')
    sendSuccess(res, recipe)
})

// PUT/PATCH /api/v1/recipe/:id
const update = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
        new:true, runValidators:true
    })
    if (!recipe) throw ApiError.notFound('recipe not found')
    sendCreate(res, recipe)
})

// DELETE /api/v1/recipe/:id
const remove = asyncHandler(async (req, res) => {
    const recipe = await Recipe.findByIdAndDelete(req.params.id)
    if (!recipe) throw ApiError.notFound('Meal Plan not found')
    sendNoContent(res)
})


module.exports = {findAll, findById, remove, create, update}
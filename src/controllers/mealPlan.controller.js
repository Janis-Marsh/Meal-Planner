'use strict'

const asyncHandler = require('../utils/asyncHandler')
const {sendSuccess, sendCreate, sendNoContent} = require('../utils/apiResponse')
const MealPlan = require('../models/mealPlan.model.js')
const ApiError = require('../utils/ApiError')
const {MEALPLAN_STATUS} = require('../config/constants')
// Stage 2:
const {parsePagination, parseSort, buildMeta, buildMealFilter} = require('../utils/queryFeatures.js')

/**
 * Plant HTTP handlers
 * 
 * each handler will be a method/service, this takes in req and completes the actions required
 */

// POST /api/v1/plants
// const create = asyncHandler(async (req, res) => {
//     return Plant.create(req.body)
// })
/**Stage 2: fields a client is allowed to see 
 * 
 * Everything else in the body is ignored. Without a list like we are about to make
 * Plant.create(req.body) lets anyone POST {'ownerId': "someone else's id"} and
 * creates a record under another account which would quietly undo the ownership rules that we made so far.
 * The server decides ownerId the client never gets a vote is ow it should be,
 * thus kind of bug is called a mass assignment bug/weakness
*/

const WRITABLE_FIELDS = ['weekStartDate', 'day', 'mealType', 'status']
// notice that ownerId was not included and should not be allow the user to change the field

function pickWritableFields(body={}){
    const payload = {}
    for (const field of WRITABLE_FIELDS){
        if(body[field] !== undefined) payload[field] = body[field]
    }
    return payload
}

// GET /api/v1/meal-plan
const findAll = asyncHandler(async (req, res) => {
    /** Stage 2: pagination, features; sorting, filtering
     * 
     * each helper function should throw a 400 ApiError on bad inputs and the asyncHandler wil forward ut to the errorHandler so this handles all forms of error 
     * */ 
    const filter = buildMealFilter(req.query)
    const sort = parseSort(req.query.sort)
    const {page, limit, skip} = parsePagination(req.query)

    /**2 queries eun together rather than one after the other the page of records and the total number of matches the client needs to know how many pages will exist. countDocuments uses the same filter so the count describes the filtered set, not the whole collection */
    const [mealPlan, total] = await Promise.all([
        MealPlan.find(filter).sort(sort).skip(skip).limit(limit),
        MealPlan.countDocuments(filter)
    ])
    /** the meta data will fo along with the sendSuccess extra argument so the response will be
     * {success, data, meta} and the single
     */
    sendSuccess(res, mealPlan, 200, {meta: buildMeta({page, limit, total})})
})

// POST /api/v1/meal-plan/
const create = asyncHandler(async (req, res) => {
    /**this is the line that plant.model.js is waiting for
     * requireAuth guarantees req.user exists so the new record is going to be stamped with the id of whoever is logged in. ownerId is set from the token, never from the body, which is why the pickWritableFields filters the body first
     */
    const mealPlan = await MealPlan.create({
        ...pickWritableFields(req.body),
        ownerId: req.user._id
        // using the mongodb is -- _id
    })
    sendCreate(res, mealPlan)
})

// GET /api/v1/meal-plan/:id
const findById = asyncHandler(async (req, res) => {
    const mealPlan = await MealPlan.findById(req.params.id)
    if (!mealPlan) throw new ApiError.notFound('Meal plan not found')
    sendSuccess(res, mealPlan)
})

// PUT/PATCH /api/v1/meal-plan/:id
const update = asyncHandler(async (req, res) => {
    const mealPlan = await MealPlan.findByIdAndUpdate(req.params.id, req.body, {
        new:true, runValidators:true
    })
    if (!mealPlan) throw ApiError.notFound('Meal plan not found')
    sendCreate(res, mealPlan)
})

// DELETE /api/v1/meal-plan/:id
const remove = asyncHandler(async (req, res) => {
    const mealPlan = await MealPlan.findByIdAndDelete(req.params.id)
    if (!mealPlan) throw ApiError.notFound('Meal Plan not found')
    sendNoContent(res)
})


module.exports = {findAll, findById, remove, create, update}
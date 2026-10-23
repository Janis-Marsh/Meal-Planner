'use strict'
/**Stage 2: Register Logins and report who you are in requests */

const asyncHandler = require('../utils/asyncHandler')
const {sendSuccess, sendCreate} = require('../utils/apiResponse')
const ApiError = require('../utils/ApiError')
const {signToken} = require('../utils/jwt')
const User = require('../models/user.model')

/** Auth HTTP handlers:
 * This is will be the same shape as plant.controller.js, it will read
 * the request, and lean on the model for rules and then answer through the shared response objects/envelope(basically not in the body of the response)
 */

// POST /api/vv1/auth/register
const register = asyncHandler(async(req,res)=>{
    const {name, email, password} = req.body ?? {}
    const user = await User.create({name, email, password})

    sendCreate(res, {user, token: signToken(user)})
})

// POST /api/v1/auth/login
const login = asyncHandler(async(req,res)=>{
    const {name, email, password} = req.body ?? {}

    if(!email || !password)
        throw ApiError.badRequest('email and password are required')

    const user = await User.findOne({email: String(email).toLowerCase().trim()}).select('+password')
    
    if(!user || !(await user.comparePassword(password))){
        throw ApiError.unauthorized('Invalid email or password')
    }

    sendSuccess(res, {user, token: signToken(user)})
})

//GET /api/v1/auth/me
const me = asyncHandler(async(res,req)=>{
    sendSuccess(res, req.user)
})

module.exports = {register, login, me}
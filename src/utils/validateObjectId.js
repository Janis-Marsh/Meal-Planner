'use strict'

const mongoose = require('mongoose')
const ApiError = require('./ApiError')

const assertValidId = (value, name = 'id') => {
    if (!mongoose.isObjectIdOrHexString(value)) {
        throw new ApiError(400, `${name} must be a valid id`)
    }
}

module.exports = { assertValidId }
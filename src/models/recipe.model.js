'use strict'

const mongoose = require('mongoose')
const {RECIPE_CATEGORY} = require('../config/constants')

const recipeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'title required'],
            trim: true,
            maxlength: [60, 'title cannot exceed 60 characters']
        },

        category: {
            type: String,
            required: true,
            enum: {values: RECIPE_CATEGORY, message: '{VALUE} is not a supported category'}
        },

        description: {
            type: String,
            default: ''
        },

        servings: {
            type: Number,
            required: [true, 'servings required'],
            min: [1, 'servings must be at least 1']
        },

        ingredients: {
            type: [String],
            validate: {
                validator: (arr) => Array.isArray(arr) && arr.length > 0,
                message: 'at least one ingredient is required'
            }
        },

        instructions: {
            type: String,
            required: [true, 'instructions required']
        },

        deletedAt: {
            type: Date,
            default: null
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true
        }
    },
    { timestamps: true }
)

recipeSchema.index({title: 1})
recipeSchema.index({ category: 1 })
recipeSchema.index({createdAt: -1})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe
const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema(
    {
        _id: {
            type: Number,
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ''
        },

        servings: {
            type: Number,
            required: true,
            min: 1
        },

        ingredients: {
            type: [String],
            required: true
        },

        instructions: {
            type: String,
            required: true
        },

        deletedAt: {
            type: Date,
            default: null
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    },
    { timestamps: true }
)

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe
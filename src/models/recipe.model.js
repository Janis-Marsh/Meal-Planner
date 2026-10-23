const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema(
    {
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

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            index: true
        }
    },
    { timestamps: true }
)

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe
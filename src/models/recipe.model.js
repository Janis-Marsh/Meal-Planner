const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'title required'],
            maxlength: [60, 'title cannot exceed 60 characters']
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

recipeSchema.index({title: 1})
// creates an index on both the status and location fields: the 1 means ascending order
recipeSchema.index({createdAt: -1})

const Recipe = mongoose.model('Recipe', recipeSchema)

module.exports = Recipe
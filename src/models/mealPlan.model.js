const mongoose = require('mongoose')

const mealPlanSchema = new mongoose.Schema(
    {
        _id: {
            type: Number,
            required: true
        },

        weekStartDate: {
            type: Date,
            required: true
        },

        meals: [
            {
                day: { type: String, required: true },
                mealType: { type: String, required: true },
                recipeName: { type: String, required: true },
            }
        ],

        status: {
            type: String,
            enum: ['draft', 'finalized'],
            default: 'draft'
        },

        createdBy: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

const MealPlan = mongoose.model('MealPlan', mealPlanSchema)

module.exports = MealPlan
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
                recipeId: {
                    type: Number,
                    ref: 'Recipe'
                },

                day: {
                    type: String,
                    required: true,
                    enum: [
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday'
                    ]
                },

                mealType: {
                    type: String,
                    required: true,
                    enum: [
                        'breakfast',
                        'lunch',
                        'dinner',
                        'snack'
                    ]
                }
            }
        ],


        status: {
            type: String,
            enum: ['draft', 'finalized'],
            default: 'draft'
        },

        createdBy: {
            type: String,
            default: null
        }
    },
    { timestamps: true }
)

const MealPlan = mongoose.model('MealPlan', mealPlanSchema)

module.exports = MealPlan
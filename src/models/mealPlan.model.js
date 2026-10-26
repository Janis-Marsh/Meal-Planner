const mongoose = require('mongoose')
const {MEALDAY, MEALTYPE, MEALPLAN_STATUSES, MEALPLAN_STATUS} = require('../config/constants')

const mealPlanSchema = new mongoose.Schema(
    {
        weekStartDate: {
            type: Date,
            required: true
        },

        meals: [
            {
                recipeId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Recipe',
                    index: true
                },

                day: {
                    type: String,
                    required: true,
                    enum: {values: MEALDAY, message: '{VALUE} is not a supported location'}
                },

                mealType: {
                    type: String,
                    required: true,
                    enum: {values: MEALTYPE, message: '{VALUE} is not a supported location'}
                }
            }
        ],


        status: {
            type: String,
            enum: {values: MEALPLAN_STATUSES, message: '{VALUE} is not a supported location'},
            default: MEALPLAN_STATUS.DRAFT
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

mealPlanSchema.index({status: 1, day: 1, mealType: 1})
// creates an index on both the status and location fields: the 1 means ascending order
mealPlanSchema.index({createdAt: -1})

const MealPlan = mongoose.model('MealPlan', mealPlanSchema)

module.exports = MealPlan
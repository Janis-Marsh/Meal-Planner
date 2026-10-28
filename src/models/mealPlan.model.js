'use strict'

const mongoose = require('mongoose')
const {MEALDAY, MEALTYPE, MEALPLAN_STATUSES, MEALPLAN_STATUS} = require('../config/constants')

const mealPlanSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'title required'],
            trim: true,
            maxlength: [60, 'title cannot exceed 60 characters']
        },
        
        weekStartDate: {
            type: Date,
            required: true
        },

        meals: [
            {
                recipeId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Recipe'
                },

                day: {
                    type: String,
                    required: true,
                    enum: {values: MEALDAY, message: '{VALUE} is not a supported day'}
                },

                mealType: {
                    type: String,
                    required: true,
                    enum: {values: MEALTYPE, message: '{VALUE} is not a supported meal type'}
                }
            }
        ],

        status: {
            type: String,
            enum: {values: MEALPLAN_STATUSES, message: '{VALUE} is not a supported status'},
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

mealPlanSchema.index({status: 1, 'meals.day': 1, 'meals.mealType': 1})
mealPlanSchema.index({weekStartDate: -1})
mealPlanSchema.index({createdAt: -1})

const MealPlan = mongoose.model('MealPlan', mealPlanSchema)

module.exports = MealPlan
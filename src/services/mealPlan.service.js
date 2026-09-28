const MealPlan = require('../models/mealPlan.model')
const ApiError = require('../utils/ApiError')

const validateMeals = (meals) => {
    if (!meals) {
        return
    }

    const mealTypesPerDay = new Set()

    for (const meal of meals) {
        const key = `${meal.day}-${meal.mealType}`

        if (mealTypesPerDay.has(key)) {
            throw new ApiError(
                400,
                `A meal plan can only have one ${meal.mealType} meal on ${meal.day}`
            )
        }

        mealTypesPerDay.add(key)
    }
}

const create = async (data) => {

    validateMeals(data.meals)

    const existingMealPlan = await MealPlan.findOne({
        week: data.week
    })

    if (existingMealPlan) {
        throw new ApiError(
            409,
            'A meal plan already exists for this week'
        )
    }

    const lastMealPlan = await MealPlan.findOne().sort({ _id: -1 })

    const nextId = lastMealPlan ? lastMealPlan._id + 1 : 1

    return await MealPlan.create({
        ...data,
        _id: nextId,
        createdBy: null
    })
}

const findAll = async () => {
    return await MealPlan.find()
}

const findById = async (id) => {
    return await MealPlan.findById(id)
}

const update = async (id, data) => {
    // Only validate meals if meals are being updated
    if (data.meals) {
        validateMeals(data.meals)
    }

    return await MealPlan.findByIdAndUpdate(
        id,
        data,
        {
            new: true,
            runValidators: true
        }
    )
}

const remove = async (id) => {
    return await MealPlan.findByIdAndDelete(id)
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
}
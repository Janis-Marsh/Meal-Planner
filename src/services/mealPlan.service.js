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
            throw new ApiError(400, `A meal plan can only have one ${meal.mealType} meal on ${meal.day}`)
        }

        mealTypesPerDay.add(key)
    }
}

const create = async (data) => {
    validateMeals(data.meals)

    const existingMealPlan = await MealPlan.findOne({
        weekStartDate: data.weekStartDate
    })

    if (existingMealPlan) {
        throw new ApiError(409,'A meal plan already exists for this week')
    }

    const mealPlan = await MealPlan.create({
        ...data,
        status: 'draft',
    })

    return mealPlan
}

const findAll = async () => {
    return await MealPlan.find({
        deletedAt: null
    })
}

const findById = async (id) => {

    const mealPlan = await MealPlan.findById(req.params.id)

    if (!mealPlan) {
        throw new ApiError(404, 'Meal plan not found')
    }

    return mealPlan
}

const update = async (id, data) => {
    const mealPlan = await MealPlan.findById(id)

    if (!mealPlan) {
        throw new ApiError(404, 'Meal plan not found')
    }

    if (mealPlan.status === 'finalized') {
        throw new ApiError(409,'A finalized meal plan cannot be modified')
    }

    if (data.meals) {
        validateMeals(data.meals)
    }

    Object.assign(mealPlan, data)

    return await mealPlan.save()
}

const remove = async (id) => {
    const mealPlan = await MealPlan.findById(id)
    
    if (!mealPlan || mealPlan.deletedAt) {
        throw new ApiError(404, 'Recipe not found')
    }
    
    mealPlan.deletedAt = new Date()
    
    await mealPlan.save()
    
    return mealPlan
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
}
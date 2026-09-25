const MealPlan = require("../models/mealPlan.model")

const create = async (mealPlanData) => {
    return await MealPlan.create(mealPlanData)
}

const findAll = async () => {
    return await MealPlan.find({}).populate('meals.recipe')
}

const findById = async (id) => {
    const mealPlan = await MealPlan.findById(id).populate('meals.recipe')

    if (!mealPlan) {
        throw new Error('Meal Plan not found');
    }

    return mealPlan
}

const update = async (id, updateData) => {
    const mealPlan = await MealPlan.findById(id)

    if (!mealPlan) {
        throw new Error('Meal Plan not found');
    }

    Object.assign(mealPlan, updateData)

    await mealPlan.save()

    return mealPlan
}

const remove = async (id) => {
    const deletedMealPlan = await MealPlan.findByIdAndDelete(id)

    if (!deletedMealPlan) {
        throw new Error('Meal Plan not found');
    }

    return deletedMealPlan
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
}
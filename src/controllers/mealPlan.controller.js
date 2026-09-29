const mealPlanService = require('../services/mealPlan.service')

const create = async (req, res) => {
    const mealPlan = await mealPlanService.create(req.body)

    res.status(201).json({
        success: true,
        data: mealPlan
    })
}

const findAll = async (_req, res) => {
    const mealPlans = await mealPlanService.findAll()

    res.status(200).json({
        success: true,
        data: mealPlans
    })
}

const findById = async (req, res) => {
    const mealPlan = await mealPlanService.findById(req.params.id)

    res.status(200).json({
        success: true,
        data: mealPlan
    })
}

const update = async (req, res) => {
    const mealPlan = await mealPlanService.update(
        req.params.id,
        req.body
    )

    res.status(200).json({
        success: true,
        data: mealPlan
    })
}

const remove = async (req, res) => {
    await mealPlanService.remove(req.params.id)

    res.status(204).send()
}

module.exports = {
    create,
    findAll,
    findById,
    update,
    remove
}
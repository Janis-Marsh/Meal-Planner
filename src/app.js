const express = require('express')
const mongoose = require('mongoose')

const app = express()

app.use(express.json())

// RECIPE SCHEMA

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

        createdBy: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

const Recipe = mongoose.model('Recipe', recipeSchema)

// MEAL PLAN SCHEMA

const mealSchema = new mongoose.Schema(
    {
        recipe: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe',
            required: true
        },

        mealType: {
            type: String,
            enum: ['breakfast', 'lunch', 'dinner', 'snack'],
            required: true
        }
    },
    { _id: false }
)

const mealPlanSchema = new mongoose.Schema(
    {
        weekStartDate: {
            type: Date,
            required: true
        },

        meals: {
            type: [mealSchema],
            default: []
        },

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

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok'
    })
})

// CREATE RECIPE
// POST /recipes

app.post('/recipes', async (req, res) => {
    try {
        const recipe = await Recipe.create(req.body)

        res.status(201).json(recipe)
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

// READ ALL RECIPES
// GET /recipes

app.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find({})

        res.status(200).json(recipes)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

// READ ONE RECIPE
// GET /recipes/:id

app.get('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)

        if (!recipe) {
            return res.status(404).json({
                error: 'Recipe not found'
            })
        }

        res.status(200).json(recipe)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

// UPDATE RECIPE
// PATCH /recipes/:id

app.patch('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)

        if (!recipe) {
            return res.status(404).json({
                error: 'Recipe not found'
            })
        }

        Object.assign(recipe, req.body)

        await recipe.save()

        res.status(200).json(recipe)
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

// DELETE RECIPE
// DELETE /recipes/:id

app.delete('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id)

        if (!recipe) {
            return res.status(404).json({
                error: 'Recipe not found'
            })
        }

        res.status(204).send()
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

// CREATE MEAL PLAN
// POST /meal-plans

app.post('/meal-plans', async (req, res) => {
    try {
        const mealPlan = await MealPlan.create(req.body)

        res.status(201).json(mealPlan)
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

// READ ALL MEAL PLANS
// GET /meal-plans

app.get('/meal-plans', async (req, res) => {
    try {
        const mealPlans = await MealPlan.find({})
            .populate('meals.recipe')

        res.status(200).json(mealPlans)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

// READ ONE MEAL PLAN
// GET /meal-plans/:id

app.get('/meal-plans/:id', async (req, res) => {
    try {
        const mealPlan = await MealPlan.findById(req.params.id)
            .populate('meals.recipe')

        if (!mealPlan) {
            return res.status(404).json({
                error: 'Meal plan not found'
            })
        }

        res.status(200).json(mealPlan)
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

// UPDATE MEAL PLAN
// PATCH /meal-plans/:id

app.patch('/meal-plans/:id', async (req, res) => {
    try {
        const mealPlan = await MealPlan.findById(req.params.id)

        if (!mealPlan) {
            return res.status(404).json({
                error: 'Meal plan not found'
            })
        }

        Object.assign(mealPlan, req.body)

        await mealPlan.save()

        res.status(200).json(mealPlan)
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
})

// DELETE MEAL PLAN
// DELETE /meal-plans/:id

app.delete('/meal-plans/:id', async (req, res) => {
    try {
        const mealPlan = await MealPlan.findByIdAndDelete(req.params.id)

        if (!mealPlan) {
            return res.status(404).json({
                error: 'Meal plan not found'
            })
        }

        res.status(204).send()
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
})

app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found'
    })
})

module.exports = app

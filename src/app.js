const express = require('express')
const mongoose = require('mongoose')

// RECIPE SCHEMA

const recipeSchema = new mongoose.Schema(
    {
        recipe_id: {
            type: Number,
            required: true
        },

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

const mealPlanSchema = new mongoose.Schema(
    {
        mealPlan_id: {
            type: Number,
            required: true
        },

        weekStartDate: {
            type: Date,
            required: true
        },

        mealType: {
            type: String,
            enum: ['breakfast', 'lunch', 'dinner', 'snack'],
            required: true
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

const app = express()

app.use(express.json())

let nextId = 1

app.get('/health', (req, res) => {
    res.status(200).json({status: 'ok'})
})

// GET all recipes
app.get('/recipes', async (req, res) => {
    try {
        const recipes = await Recipe.find({})
     
        res.status(200).json(recipes)

    } catch (error) {
        res.status(500).json({error: "Recipe not Found"})
    }
})

// READ --- 200 or 404
app.get('/recipes/:id', async (req, res) => {
    try {
      
        const recipe = await Recipe.find({recipe_id: Number(req.params.id)})
   
        if(!recipe) return res.status(404).json({error: 'Recipe not found'})
      
        res.status(200).json(recipe)
    
    } catch (error) {
        res.status(500).json({error: "Recipe not Found"})
    }
})


// CREATE --- 201
app.post('/recipes', async (req, res) => {
    try {
        const recipe = await Recipe.create({recipe_id:String(nextId++), ...req.body})
        res.status(201).json(recipe)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// UPDATE --- 200 or 404
app.patch('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findOneAndUpdate({recipe_id: Number(req.params.id)})

        if(!recipe) return res.status(404).json({error: "Recipe not Found"})

        Object.assign(recipe, req.body)

        await recipe.save()
       
        res.status(200).json(recipe)

    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// DELETE -- 204
app.delete('/recipes/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findOneAndDelete({recipe_id:req.params.id}).exec()
        if(!recipe) return res.status(404).json({error: "Recipe not Found"})
        
        res.status(204).send()
    } catch (error) {
        res.status(500).json({error: error.message})
    }
    
})

// GET all
app.get('/meal-plans', async (req, res) => {
    try {
        const mealPlans = await MealPlan.find({})
     
        res.status(200).json(mealPlans)
    } catch (error) {
        res.status(500).json({error: "Meal plans not Found"})
    }
})

// GET
app.get('/meal-plans/:id', async (req, res) => {
    try {
        const mealPlan = await MealPlan.find({mealPlan_id: Number(req.params.id)})
   
        if(!mealPlan) return res.status(404).json({error: 'Meal plan not found'})
      
        res.status(200).json(mealPlan)
    
    } catch (error) {
        res.status(500).json({error: "Meal plan not Found"})
    }
})

// CREATE
app.post('/meal-plans', async (req, res) => {
     try {
        const mealPlan = await MealPlan.create({mealPlan_id:String(nextId++), ...req.body})
        res.status(201).json(mealPlan)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// UPDATE
app.patch('/meal-plans/:id', async (req, res) => {
    try {
        const mealPlan = await MealPlan.findOneAndUpdate({mealPlan_id: Number(req.params.id)})

        if(!mealPlan) return res.status(404).json({error: "Meal plan not Found"})

        Object.assign(mealPlan, req.body)

        await mealPlan.save()
       
        res.status(200).json(mealPlan)

    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// DELETE 
app.delete('/meal-plans/:id', async (req, res) => {
     try {
        const mealPlan = await MealPlan.findOneAndDelete({mealPlan_id:req.params.id}).exec()
        if(!mealPlan) return res.status(404).json({error: "Meal plan not Found"})
        
        res.status(204).send()
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports = app

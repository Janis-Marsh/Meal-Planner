const express = require('express');
const router = express.Router();
const mealPlanController = require('../controllers/mealPlan.controller');

router.get('/meal-plans', mealPlanController.getMealPlans);
router.get('/meal-plans/:id', mealPlanController, getMealPlan);
router.post('/meal-plans', mealPlanController.createMealPlan);

module.exports = router;
// routes/expenses/index.js
const express = require('express');
const router = express.Router();
const expensesController = require('../../controllers/expenses');

router.get('/', expensesController.getAll);
router.post('/', expensesController.create);
router.get('/:id', expensesController.getOne);
router.put('/:id', expensesController.update);
router.delete('/:id', expensesController.delete);

module.exports = router;
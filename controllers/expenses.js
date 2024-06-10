const Expense = require('../models/expense');

exports.getAll = async (req, res) => {
    const expenses = await Expense.findAll();
    res.json(expenses);
};

exports.create = async (req, res) => {
    const errorMessage = validateRequestBody(req);
    if (errorMessage) {
        return res.status(400).send(errorMessage);
    }

    const expense = await Expense.create(req.body);
    res.json(expense);
};

exports.getOne = async (req, res) => {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
        return res.status(404).send('Expense not found');
    }
    res.json(expense);
};

exports.update = async (req, res) => {
    const errorMessage = validateRequestBody(req);
    if (errorMessage) {
        return res.status(400).send(errorMessage);
    }

    const expense = await Expense.findByPk(req.params.id);
    if (expense) {
        await expense.update(req.body);
        res.json(expense);
    } else {
        res.status(404).send('Expense not found');
    }
};

exports.delete = async (req, res) => {
    const expense = await Expense.findByPk(req.params.id);
    if (expense) {
        await expense.destroy();
        res.status(204).send();
    } else {
        res.status(404).send('Expense not found');
    }
};

function validateRequestBody(req) {
    const { title, amount, category, date } = req.body;
    const categories = ['食', '衣', '住', '行'];
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const dateObj = new Date(date);

    if (!title  || !dateObj || !category) return 'Missing required fields';
    if (amount <= 0) return 'Amount must be greater than 0';
    if (!categories.includes(category)) return 'Category must be 食、衣、住、行';
    if (dateObj < oneYearAgo || dateObj > now) return 'Date must be in recent 1 year';

    return null;
}
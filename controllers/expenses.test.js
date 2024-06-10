const request = require('supertest');
const app = require('../app');
const server = require('../app');
const Expense = require('../models/expense');

afterAll(done => {
    server.close(done);
});

// GET /expenses

test('returns a list of expenses', async () => {
    // Arrange
    const expenses = [
        { id: 1, title: 'Lunch', amount: 10, category: '食', date: '2021-01-01' },
        { id: 2, title: 'Dinner', amount: 20, category: '食', date: '2021-01-02' },
        { id: 3, title: 'Shirt', amount: 30, category: '衣', date: '2021-01-03' },
    ];
    jest.spyOn(Expense, 'findAll').mockResolvedValue(expenses);

    // Act
    const response = await request(app).get('/expenses');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expenses);
});

// GET /expenses/:id

test('returns a single expense', async () => {
    // Arrange
    const expense = { id: 1, title: 'Lunch', amount: 10, category: '食', date: '2021-01-01' };
    jest.spyOn(Expense, 'findByPk').mockResolvedValue(expense);

    // Act
    const response = await request(app).get('/expenses/1');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expense);
});

test('returns 404 if expense is not found', async () => {
    // Arrange
    jest.spyOn(Expense, 'findByPk').mockResolvedValue(null);

    // Act
    const response = await request(app).get('/expenses/1');

    // Assert
    expect(response.status).toBe(404);
    expect(response.text).toBe('Expense not found');
});

// POST /expenses

test('creates a new expense', async () => {
    // Arrange
    const newExpense = { title: 'Lunch', amount: 10, category: '食', date: '2024-01-01' };
    const createdExpense = { id: 1, ...newExpense };
    jest.spyOn(Expense, 'create').mockResolvedValue(createdExpense);

    // Act
    const response = await request(app)
        .post('/expenses')
        .send(newExpense);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(createdExpense);
});

test('returns 400 if date is not in current 1 year', async () => {
    // Arrange
    const invalidExpense = { title: 'Lunch', amount: 10, category: '食', date: '2000-01-01' };

    // Act
    const response = await request(app)
        .post('/expenses')
        .send(invalidExpense);

    // Assert
    expect(response.status).toBe(400);
    expect(response.text).toBe('Date must be in recent 1 year');
});

test('returns 400 if amount is not greater than 0', async () => {
    // Arrange
    const invalidExpense = { title: 'Lunch', amount: 0, category: '食', date: '2024-01-01' };

    // Act
    const response = await request(app)
        .post('/expenses')
        .send(invalidExpense);

    // Assert
    expect(response.status).toBe(400);
    expect(response.text).toBe('Amount must be greater than 0');
});

test('returns 400 if category is not 食、衣、住、行', async () => {
    // Arrange
    const invalidExpense = { title: 'Lunch', amount: 10, category: '娛', date: '2024-01-01' };

    // Act
    const response = await request(app)
        .post('/expenses')
        .send(invalidExpense);

    // Assert
    expect(response.status).toBe(400);
    expect(response.text).toBe('Category must be 食、衣、住、行');
});

// PUT /expenses/:id

test('returns 404 if expense is not found', async () => {
    // Arrange
    jest.spyOn(Expense, 'findByPk').mockResolvedValue(null);

    // Act
    const response = await request(app)
        .put('/expenses/1')
        .send({ title: 'Lunch', amount: 10, category: '食', date: '2024-01-01' });

    // Assert
    expect(response.status).toBe(404);
    expect(response.text).toBe('Expense not found');
});

test('returns 200 if expense is updated', async () => {
    // Arrange
    const requestBody = { title: 'Dinner', amount: 20, category: '食', date: '2024-01-01' };
    const expectedExpense = { id: 1, ...requestBody };
    jest.spyOn(Expense, 'findByPk').mockResolvedValue({ update: jest.fn().mockResolvedValue(expectedExpense), ...expectedExpense });

    // Act
    const response = await request(app)
        .put('/expenses/1')
        .send(requestBody);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedExpense);
});

// DELETE /expenses/:id

test('returns 204 if expense is deleted', async () => {
    // Arrange
    jest.spyOn(Expense, 'findByPk').mockResolvedValue({ destroy: jest.fn() });

    // Act
    const response = await request(app).delete('/expenses/1');

    // Assert
    expect(response.status).toBe(204);
});

test('returns 404 if expense is not found', async () => {
    // Arrange
    jest.spyOn(Expense, 'findByPk').mockResolvedValue(null);

    // Act
    const response = await request(app).delete('/expenses/1');

    // Assert
    expect(response.status).toBe(404);
    expect(response.text).toBe('Expense not found');
});
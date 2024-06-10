const express = require('express');
const app = express();
app.use(express.json());
const port = 3000;

const expensesRouter = require('./routes/expenses');

app.use('/expenses', expensesRouter);
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
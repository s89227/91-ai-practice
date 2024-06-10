// const axios = require('axios');


window.onload = function () {
    document.getElementById('submit-expense').addEventListener('click', () => {
        const title = document.getElementById('title').value;
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;

        axios.post('http://localhost:3000/expenses', {
            title,
            amount,
            category,
            date
        })
            .then(response => {
                console.log('Success:', response);
                location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
                // show error message in id error-message
                const errorMessage = document.getElementById('error-message');
                errorMessage.innerHTML = 'An error occurred while loading the expenses';
            });
    });


    axios.get('http://localhost:3000/expenses')
        .then(response => {
            // Retrieve the data from the response
            const expenses = response.data;

            // Render the data in HTML id expenses-table
            const expensesTable = document.getElementById('expenses-table');
            expenses.forEach(expense => {
                const row = document.createElement('tr');
                row.innerHTML = `
            <td>${expense.id}</td>
            <td>${expense.title}</td>
            <td>${expense.amount}</td>
            <td>${expense.category}</td>
            <td>${expense.date}</td>
        `;
                expensesTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            // show error message in id error-message
            const errorMessage = document.getElementById('error-message');
            errorMessage.innerHTML = 'An error occurred while loading the expenses';
        });
};
// Redirect to profile page when avatar is clicked
document.getElementById('avatar-icon').addEventListener('click', function () {
    window.location.href = 'profile.html';
  });
  
// Dark mode toggle functionality
const themeToggle = document.getElementById('theme-toggle');
let darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';

if (darkModeEnabled) {
    enableDarkMode();
}

themeToggle.addEventListener('click', function () {
    darkModeEnabled = !darkModeEnabled;
    if (darkModeEnabled) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
});

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    document.querySelector('.sidebar').classList.add('dark-mode');
    document.querySelector('.main-content').classList.add('dark-mode');
    document.querySelector('.expenses-section').classList.add('dark-mode');
    document.querySelector('.expenses-table').classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
    
    // Switch to sun icon for light mode toggle
    themeToggle.src = 'images/brightness.png';
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    document.querySelector('.sidebar').classList.remove('dark-mode');
    document.querySelector('.main-content').classList.remove('dark-mode');
    document.querySelector('.expenses-section').classList.remove('dark-mode');
    document.querySelector('.expenses-table').classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
    
    // Switch back to moon icon for dark mode toggle
    themeToggle.src = 'images/dark.png';
}

  // Selectors for modal and form elements
const addExpenseBtn = document.getElementById('add-expense-btn');
const expenseModal = document.getElementById('expense-modal');
const closeModal = document.getElementById('close-modal');
const expenseForm = document.getElementById('expense-form');
const expensesBody = document.getElementById('expenses-body');

// Show the modal when "Add New" button is clicked
if (addExpenseBtn) {
    addExpenseBtn.addEventListener('click', () => {
        console.log("Add New button clicked"); // Debugging log
        expenseModal.style.display = 'flex';
    });
} else {
    console.error("Add Expense Button not found");
}

// Hide the modal when "X" button is clicked
if (closeModal) {
    closeModal.addEventListener('click', () => {
        console.log("Close button clicked"); // Debugging log
        expenseModal.style.display = 'none';
    });
} else {
    console.error("Close Modal Button not found");
}

// Close modal when clicking outside of modal content
window.addEventListener('click', (event) => {
    if (event.target === expenseModal) {
        console.log("Clicked outside modal"); // Debugging log
        expenseModal.style.display = 'none';
    }
});

// Add new expense entry to the table upon form submission
if (expenseForm) {
    expenseForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent form from submitting traditionally
        console.log("Form submitted"); // Debugging log

        // Get form values
        const date = document.getElementById('expense-date').value;
        const category = document.getElementById('expense-category').value;
        const amount = document.getElementById('expense-amount').value;
        const status = document.getElementById('expense-status').value;
        const platform = document.getElementById('expense-platform').value;
        const type = document.getElementById('expense-type').value;

        // Add a new row to the expenses table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${date}</td>
            <td>${category}</td>
            <td>${parseFloat(amount).toFixed(2)}</td>
            <td><span class="${status.toLowerCase()}-status">${status}</span></td>
            <td>${platform}</td>
            <td>${type}</td>
        `;
        expensesBody.appendChild(row);

        // Apply status color classes
        const statusCell = row.querySelector('span');
        statusCell.style.color = status === "Completed" ? "#28a745" : "#ffc107";

        // Clear form and close modal
        expenseForm.reset();
        expenseModal.style.display = 'none';
    });
} else {
    console.error("Expense Form not found");
}

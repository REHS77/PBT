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
  document.querySelectorAll('.card').forEach(card => card.classList.add('dark-mode'));
  document.querySelectorAll('.category-card').forEach(category => category.classList.add('dark-mode'));
  document.querySelector('.transaction-chart').classList.add('dark-mode');
  document.querySelector('.recent-transactions').classList.add('dark-mode');
  localStorage.setItem('darkMode', 'enabled');
  themeToggle.src = 'images/brightness.png';
}

function disableDarkMode() {
  document.body.classList.remove('dark-mode');
  document.querySelector('.sidebar').classList.remove('dark-mode');
  document.querySelector('.main-content').classList.remove('dark-mode');
  document.querySelectorAll('.card').forEach(card => card.classList.remove('dark-mode'));
  document.querySelectorAll('.category-card').forEach(category => category.classList.remove('dark-mode'));
  document.querySelector('.transaction-chart').classList.remove('dark-mode');
  document.querySelector('.recent-transactions').classList.remove('dark-mode');
  localStorage.setItem('darkMode', 'disabled');
  themeToggle.src = 'images/dark.png';
}

// Modal functionality
const addNewButton = document.querySelector('.add-new');
const expenseCategoriesContainer = document.querySelector('.expense-categories');
const modal = document.getElementById('addCategoryModal');
const closeModal = document.getElementById('closeModal');
const categoryInput = document.getElementById('categoryInput');
const submitCategory = document.getElementById('submitCategory');

// Open modal for adding new category
addNewButton.addEventListener('click', () => {
  modal.classList.add('show');
  categoryInput.value = '';
  categoryInput.focus();
});

// Close modal
closeModal.addEventListener('click', () => modal.classList.remove('show'));
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('show');
});

// Add new category
submitCategory.addEventListener('click', () => {
  const categoryName = categoryInput.value.trim();
  if (categoryName) {
    addCategory(categoryName);
    modal.classList.remove('show');
  }
});

// Chart.js setup for the expense chart
const ctx = document.getElementById('expenseChart').getContext('2d');
const expenseChart = new Chart(ctx, {
  type: 'doughnut',
  data: {
    labels: ['Food', 'Travel', 'Rent', 'Shopping', 'Medicine'],
    datasets: [{
      data: [500, 300, 200, 400, 100],
      backgroundColor: ['#9D4EDD', '#C99CEC', '#0A9C4E', '#F47F8C', '#F79E1B'],
      hoverOffset: 4
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
    }
  }
});

// Local Storage Keys
const INCOME_KEY = 'userIncome';
const EXPENSES_KEY = 'userExpenses';
const CATEGORIES_KEY = 'expenseCategories';
const TRANSACTIONS_KEY = 'recentTransactions';

// Initialize local storage data
function initializeLocalStorage() {
  if (!localStorage.getItem(INCOME_KEY)) localStorage.setItem(INCOME_KEY, '0');
  if (!localStorage.getItem(EXPENSES_KEY)) localStorage.setItem(EXPENSES_KEY, '0');
  if (!localStorage.getItem(CATEGORIES_KEY)) localStorage.setItem(CATEGORIES_KEY, JSON.stringify(['Food', 'Travel', 'Rent', 'Shopping', 'Medicine']));
  if (!localStorage.getItem(TRANSACTIONS_KEY)) localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([]));
}
initializeLocalStorage();

// Update the income, expenses, and balance displayed on summary cards
function updateSummaryCards() {
  const totalIncome = parseFloat(localStorage.getItem(INCOME_KEY));
  const totalExpenses = parseFloat(localStorage.getItem(EXPENSES_KEY));
  const balance = totalIncome - totalExpenses;

  document.querySelector('.income-card').innerHTML = `<span class="card-icon">💰</span> € ${totalIncome}<br><span>Total Income</span>`;
  document.querySelector('.expense-card').innerHTML = `<span class="card-icon">💸</span> € ${totalExpenses}<br><span>Total Expenses</span>`;
  document.querySelector('.balance-card').innerHTML = `<span class="card-icon">💼</span> € ${balance}<br><span>Total Balance</span>`;
}
updateSummaryCards();

// Load and display categories
function loadCategories() {
  const categories = JSON.parse(localStorage.getItem(CATEGORIES_KEY));
  expenseCategoriesContainer.innerHTML = '';
  
  categories.forEach(category => {
    const categoryCard = document.createElement('div');
    categoryCard.classList.add('category-card');
    categoryCard.textContent = category;
    
    // Add event listener for opening transaction modal
    categoryCard.addEventListener('click', () => openTransactionModal(category));
    
    expenseCategoriesContainer.appendChild(categoryCard);
  });
  
  expenseCategoriesContainer.appendChild(addNewButton); // Re-append the add button
}
loadCategories();

// Add a new category
function addCategory(categoryName) {
  const categories = JSON.parse(localStorage.getItem(CATEGORIES_KEY));
  
  if (!categories.includes(categoryName)) { // Prevent duplicates
    categories.push(categoryName);
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    loadCategories();
  }
}

// Delete a category
function deleteCategory(categoryName) {
  let categories = JSON.parse(localStorage.getItem(CATEGORIES_KEY));
  categories = categories.filter(category => category !== categoryName);
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));

  // Remove transactions for this category
  let transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY));
  transactions = transactions.filter(transaction => transaction.category !== categoryName);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));

  updateChart();
  updateRecentTransactions();
  loadCategories();
}

// Add a transaction (income or expense)
function addTransaction(category, amount, type) {
  const transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY));
  transactions.push({ category, amount: parseFloat(amount), type, date: new Date().toLocaleString() });
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  
  if (type === 'expense') updateTotalExpenses(amount);
  else addIncome(amount);
  
  updateRecentTransactions();
  updateChart();
}

// Update total expenses
function updateTotalExpenses(amount) {
  const currentExpenses = parseFloat(localStorage.getItem(EXPENSES_KEY));
  localStorage.setItem(EXPENSES_KEY, (currentExpenses + parseFloat(amount)).toString());
  updateSummaryCards();
}

// Add income
function addIncome(amount) {
  const currentIncome = parseFloat(localStorage.getItem(INCOME_KEY));
  localStorage.setItem(INCOME_KEY, (currentIncome + parseFloat(amount)).toString());
  updateSummaryCards();
}

// Update recent transactions section
function updateRecentTransactions() {
  const transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY));
  const recentTransactionsContainer = document.querySelector('.recent-transactions');
  recentTransactionsContainer.innerHTML = '<h3>Recent Transactions</h3>';
  transactions.slice(-5).forEach(transaction => {
    const transactionDiv = document.createElement('div');
    transactionDiv.textContent = `${transaction.date} - ${transaction.category}: €${transaction.amount} (${transaction.type})`;
    recentTransactionsContainer.appendChild(transactionDiv);
  });
}
updateRecentTransactions();

// Update doughnut chart
function updateChart() {
  const transactions = JSON.parse(localStorage.getItem(TRANSACTIONS_KEY));
  const categories = JSON.parse(localStorage.getItem(CATEGORIES_KEY));

  const categoryAmounts = categories.map(category => {
    return transactions
      .filter(transaction => transaction.category === category && transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  });

  expenseChart.data.labels = categories;
  expenseChart.data.datasets[0].data = categoryAmounts;
  expenseChart.update();
}
updateChart();

// Handle modal interactions
function openTransactionModal(category) {
  const transactionModal = document.getElementById('transactionModal');
  transactionModal.classList.add('show');
  document.getElementById('transactionAmount').value = '';
  document.getElementById('transactionType').value = 'expense';
  document.getElementById('submitTransaction').onclick = function () {
    const amount = document.getElementById('transactionAmount').value;
    const type = document.getElementById('transactionType').value;
    if (amount) {
      addTransaction(category, amount, type);
      transactionModal.classList.remove('show');
    }
  };
    // Set the delete category button functionality
    document.getElementById('deleteCategory').onclick = function () {
      deleteCategory(category);
      transactionModal.classList.remove('show'); // Close the modal after deletion
    };
}

// Initialize event listeners
document.getElementById('closeTransactionModal').addEventListener('click', () => {
  document.getElementById('transactionModal').classList.remove('show');
});

addNewButton.addEventListener('click', () => {
  modal.classList.add('show');
});

submitCategory.addEventListener('click', () => {
  const categoryName = categoryInput.value.trim();
  if (categoryName) {
    addCategory(categoryName);
    modal.classList.remove('show');
  }
});

closeModal.addEventListener('click', () => modal.classList.remove('show'));
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('show');
});

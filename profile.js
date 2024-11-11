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
    localStorage.setItem('darkMode', 'enabled');
    
    // Switch to sun icon for light mode toggle
    themeToggle.src = 'images/brightness.png';
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    document.querySelector('.sidebar').classList.remove('dark-mode');
    document.querySelector('.main-content').classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
    
    // Switch back to moon icon for dark mode toggle
    themeToggle.src = 'images/dark.png';
}

// Selectors for modal and form elements
const addBillBtn = document.getElementById('add-bill-btn');
const billModal = document.getElementById('bill-modal');
const closeModal = document.getElementById('close-modal');
const billForm = document.getElementById('bill-form');
const billsBody = document.getElementById('bills-body');

// Show the modal when "Add New Bill" button is clicked
addBillBtn.addEventListener('click', () => {
    billModal.style.display = 'flex';
});

// Hide the modal when "X" button is clicked
closeModal.addEventListener('click', () => {
    billModal.style.display = 'none';
});

// Close modal when clicking outside of modal content
window.addEventListener('click', (event) => {
    if (event.target === billModal) {
        billModal.style.display = 'none';
    }
});

// Add new bill entry to the table upon form submission
billForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form from submitting traditionally

    // Get form values
    const name = document.getElementById('bill-name').value;
    const frequency = document.getElementById('bill-frequency').value;
    const amount = document.getElementById('bill-amount').value;

    // Add a new row to the bills table with status toggle and delete button
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${name}</td>
        <td>${frequency}</td>
        <td>${parseFloat(amount).toFixed(2)}</td>
        <td>
            <button class="status-btn status-pending">Pending</button>
        </td>
        <td>
            <button class="delete-btn">Delete</button>
        </td>
    `;
    billsBody.appendChild(row);

    // Clear form and close modal
    billForm.reset();
    billModal.style.display = 'none';
});

// Toggle status and delete bill functionality
billsBody.addEventListener('click', (event) => {
    const target = event.target;

    // Check if status button is clicked
    if (target.classList.contains('status-btn')) {
        if (target.textContent === "Pending") {
            target.textContent = "Completed";
            target.classList.remove('status-pending');
            target.classList.add('status-completed');
        } else {
            target.textContent = "Pending";
            target.classList.remove('status-completed');
            target.classList.add('status-pending');
        }
    }

    // Check if delete button is clicked
    if (target.classList.contains('delete-btn')) {
        target.closest('tr').remove();
    }
});

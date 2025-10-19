// Get DOM elements
const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

const salaryFormEl = document.getElementById("salary-form");
const salaryInputEl = document.getElementById("salary-input");

// Get saved data from localStorage
let salary = parseFloat(localStorage.getItem("salary")) || 0;
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// ------------------ SALARY FORM ------------------
salaryFormEl.addEventListener("submit", function (e) {
  e.preventDefault();
  const inputSalary = parseFloat(salaryInputEl.value);
  if (isNaN(inputSalary) || inputSalary < 0) return;

  salary = inputSalary;
  localStorage.setItem("salary", salary);

  updateSummary();
  salaryFormEl.reset();
});

// ------------------ TRANSACTION FORM ------------------
transactionFormEl.addEventListener("submit", function (e) {
  e.preventDefault();

  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);

  if (!description || isNaN(amount) || amount === 0) return;

  const transaction = {
    id: Date.now(),
    description,
    amount,
  };

  transactions.push(transaction);
  localStorage.setItem("transactions", JSON.stringify(transactions));

  addTransactionToDOM(transaction);
  updateSummary();

  transactionFormEl.reset();
});

// ------------------ ADD TRANSACTION TO DOM ------------------
function addTransactionToDOM(transaction) {
  const li = document.createElement("li");
  li.classList.add("transaction");
  li.classList.add(transaction.amount > 0 ? "income" : "expense");

  li.innerHTML = `
    <span>${transaction.description}</span>
    <span>
      ${formatCurrency(transaction.amount)}
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    </span>
  `;

  transactionListEl.prepend(li);
}

// ------------------ REMOVE TRANSACTION ------------------
function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  localStorage.setItem("transactions", JSON.stringify(transactions));
  updateTransactionList();
  updateSummary();
}

// ------------------ UPDATE TRANSACTION LIST ------------------
function updateTransactionList() {
  transactionListEl.innerHTML = "";
  transactions.slice().reverse().forEach((t) => addTransactionToDOM(t));
}

// ------------------ UPDATE BALANCE, INCOME, EXPENSES ------------------
function updateSummary() {
  const totalExpenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const totalIncome = transactions
    .filter((t) => t.amount > 0)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = salary + totalIncome - totalExpenses;

  balanceEl.textContent = formatCurrency(balance);
  incomeAmountEl.textContent = formatCurrency(salary + totalIncome);
  expenseAmountEl.textContent = formatCurrency(totalExpenses);
}

// ------------------ FORMAT CURRENCY ------------------
function formatCurrency(number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(number);
}

// ------------------ INITIAL RENDER ------------------
updateTransactionList();
updateSummary();

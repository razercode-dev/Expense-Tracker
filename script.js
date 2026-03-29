const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const formatRupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions')) || [];


let transactions =
localStorage.getItem('transactions') !== null
? localStorageTransactions
: [];

function addTransaction(e) {
    e.preventDefault()

    if(text.value.trim() === "" || amount.value.trim() === ""){
        alert("Please add an expense and amount")
    } else {
        const transaction = {
            id: generateId(),
            text: text.value,
            amount: +amount.value,
        };

        transactions.push(transaction);

        updateLocalStorage()
        init();

        text.value = "";
        amount.value = "";
    }
}

function addTransactionDOM(transaction){
    const sign = transaction.amount < 0 ? "-" : "+"
    const item = document.createElement('li')

    item.classList.add(transaction.amount < 0 ? "minus" : "plus")
    item.innerHTML = `
        ${transaction.text} <span>${sign} ${formatRupiah(Math.abs(transaction.amount))}</span>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
    list.appendChild(item);
}

function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateValues() {
  const amounts = transactions.map((t) => t.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0);

  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => acc + item, 0);

  const expense =
    amounts
      .filter((item) => item < 0)
      .reduce((acc, item) => acc + item, 0) * -1;

  balance.innerText = `${formatRupiah(total)}`;
  money_plus.innerText = `+ ${formatRupiah(income)}`;
  money_minus.innerText = `- ${formatRupiah(Math.abs(expense))}`;
}

function removeTransaction(id){
    transactions = transactions.filter((transaction) => transaction.id !== id
)
updateLocalStorage()

init();


}



function init() {
    list.innerHTML = "";

    transactions.forEach(addTransactionDOM);
    updateValues();
    console.log(balance, money_plus, money_minus);
}

init();
function generateId() {
    return Math.floor(Math.random() * 1000000000);
}

form.addEventListener("submit", addTransaction);
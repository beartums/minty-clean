export const getSignedAmount = (transaction) => {
  let amount = (transaction.account_name === 'XXXXX3755' ? -1 : 1) * transaction.amount;
  return amount * (transaction.transaction_type === 'debit' ? -1 : 1);

}

export const getCategories = (transactions, minDate) => {
  let catHash = {};
  let displayTransactions;
  // If ignoring early trasnactions, MINDATE will be assigned
  if (minDate) {
    let filterDate = minDate.toISOString();
    displayTransactions = transactions.filter( transaction => {
      let tranDate = new Date(transaction.date).toISOString();
      return tranDate >= filterDate;
    })
  } else {
    displayTransactions = transactions;
  }

  displayTransactions.forEach(transaction => {
    let category = transaction.category;
    if (!catHash[category]) {
      catHash[category] = {
        name: category,
        transactions: [],
        sum: 0
      }
    }
    catHash[category].transactions.push(transaction);
    catHash[category].sum += getSignedAmount(transaction);
  });
  return catHash;
}
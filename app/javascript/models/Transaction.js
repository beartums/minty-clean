import CollectionManager from "./CollectionManager";

class Transaction {
  static collection
  static indices = [
    {name: "byId", properties: ['id'], isCollection: false},
    {name: "byIsoDate", properties: ['isoDate'], isCollection: false},
    {name: "byYearAndMonth", properties: ['year','month'], isCollection: false},
    {name: "byCategory", properties: ['category'], isCollection: false},
    {name: "byAccount", properties: ['account_name'], isCollection: false},

  ]
  // this passed-in transaction is the object from the ruby JSON
  constructor(transaction) {
    Object.keys(transaction).forEach(key => {
      this[key] = transaction[key];
    });
    let aDate = this.date.split('-');
    this.month = aDate[1]-1;
    this.year = aDate[0];
    this.day = aDate[2];
    this.isoDate = this.date;
    this.date = new Date(this.year,this.month,this.day);
    if (!Transaction.collection) this.createCollectionManager()
    Transaction.collection.push(this)
  }
  get signedAmount() {
    let amount = (this.account_name === 'XXXXX3755' ? -1 : 1) * this.amount;
    return amount * (this.transaction_type === 'debit' ? -1 : 1);
  }
  createCollectionManager() {
    Transaction.collection = new CollectionManager('transaction','id', 'collection');
    Transaction.collection.addIndices(Transaction.indices);
  }
  getTransactionManager() {
    return Transaction.collection;
  }
}

export default Transaction;
import CollectionManager from './CollectionManager';

class Transaction {
  static collection

  static indices = [
    { name: 'byId', properties: ['id'], isCollection: false },
    { name: 'byIsoDate', properties: ['isoDate'], isCollection: true },
    { name: 'byYearAndMonth', properties: ['year', 'month'], isCollection: true },
    { name: 'byCategory', properties: ['category'], isCollection: true },
    { name: 'byAccountName', properties: ['accountName'], isCollection: true },
    { name: 'byPeriodAndCategoryGroup', properties: ['periodId', 'categoryGroupId'], isCollection: true },
  ]

  static collectionInfo = {
    maxDate: '',
    minDate: '',
  }

  // this passed-in transaction is the object from the ruby JSON
  constructor(transaction) {
    if (!this.collection) this.createCollectionManager();
    Object.keys(transaction).forEach((key) => {
      this[`_${key}`] = transaction[key];
    });
    this.isoDate = this._date;

    const info = Transaction.collectionInfo;
    if (!info.maxDate || info.maxDate < this.date) info.maxDate = this.date;
    if (!info.minDate || info.minDate > this.date) info.minDate = this.date;

    this.collection.push(this);
  }

  get category() { return this._category; }

  get id() { return this._id; }

  get date() { return this._date; }

  get isoDate() { return this._isoDate; }

  get description() { return this._description; }

  get originalDescription() { return this._originalDescription; }

  get accountName() { return this._accountName; }

  get notes() { return this._notes; }

  get transactionType() { return this._transactionType; }

  get labels() { return this._labels; }

  get amount() { return this._amount; }

  get categoryGroupId() { return this._categoryGroupId; }

  // eslint-disable-next-line class-methods-use-this
  get collection() { return Transaction.collection; }

  get periodId() { return this._periodId; }

  get signedAmount() {
    const amount = (this.accountName === 'XXXXX3755' ? -1 : 1) * this.amount;
    return amount * (this.transactionType === 'debit' ? -1 : 1);
  }

  set isoDate(isoDate) {
    const aDate = isoDate.split('-');
    [this._year, this._month, this._day] = aDate;
    this._month -= 1;
    this._isoDate = this.date;
    this._date = new Date(this._year, this._month, this._day);
  }

  set category(categoryName) {
    this._category = categoryName;
    this.collection.reindex(this);
  }

  set categoryGroup(categoryGroup) {
    this._categoryGroup = categoryGroup;
    this._categoryGroupId = categoryGroup.id;
    this.collection.reindex(this);
  }

  set period(period) {
    this._period = period;
    this._periodId = period.id;
    this.collection.reindex(this);
  }

  createCollectionManager = () => {
    Transaction.collection = new CollectionManager('transaction', 'id', 'collection');
    Transaction.collection.addIndices(Transaction.indices);
  }

  getTransactionManager = () => Transaction.collection;
}

export default Transaction;

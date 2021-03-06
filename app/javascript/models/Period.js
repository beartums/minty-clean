/* eslint-disable arrow-body-style */
import moment from 'moment';
import { getSignedAmount } from '../services/transactionService';
import CollectionManager from './CollectionManager';
import Transaction from './Transaction';

export default class Period {
  static collection;

  static indices = [
    { name: 'byId', properties: ['id'], isCollection: false },
  ]

  rangeType = 'M';

  rangeCount = 1;

  startDate = null;

  endDate = null;

  transactions = [];

  transactionsByCategory = [];

  totalsByCategory = {};

  constructor(referenceStartDate, periodOffset, rangeType, rangeCount) {
    referenceStartDate = typeof (referenceStartDate) === 'string'
      ? Period.isoToDate(referenceStartDate)
      : referenceStartDate;
    this.rangeType = rangeType ? rangeType.toUpperCase() : 'M';
    this.rangeCount = rangeCount || 1;
    periodOffset = periodOffset || 0;
    const totalRangeCount = rangeCount * periodOffset;
    const startDate = moment(referenceStartDate).add(totalRangeCount, rangeType);
    this.startDate = startDate.toDate();
    const endDate = startDate.add(this.rangeCount, this.rangeType);
    this.endDate = endDate.toDate();
    if (!this.collection) this.initCollection();
    this.collection.push(this);
  }

  get id() {
    return `${this.isoStartDate}->${this.isoEndDate}`;
  }

  get isoStartDate() {
    return this.startDate.toISOString().split('T')[0];
  }

  get isoEndDate() {
    return this.endDate.toISOString().split('T')[0];
  }

  // eslint-disable-next-line class-methods-use-this
  get collection() {
    return Period.collection;
  }

  // eslint-disable-next-line class-methods-use-this
  initCollection() {
    Period.createCollection();
  }

  static createCollection() {
    Period.collection = new CollectionManager('Period', 'id', 'Periods');
    this.collection.addIndices(Period.indices);
  }

  setPeriodTransactions = (transactions) => {
    // take a list of raw transactions and collect them if they are in this period
    this.transactions = [];
    this.transactionsByCategory = {};
    this.totalsByCategory = {};

    transactions.forEach((transaction) => {
      if (this.isInPeriod(transaction.date)) {
        this.addTransaction(transaction);
      }
    });
  }

  addTransaction = (transaction) => {
    if (!this.transactions) this.transactions = [];
    this.transactions.push(transaction);

    if (!this.transactionsByCategory) this.transactionsByCategory = {};
    if (!this.transactionsByCategory[transaction.category]) {
      this.transactionsByCategory[transaction.category] = [];
      this.totalsByCategory[transaction.category] = 0;
    }
    this.transactionsByCategory[transaction.category].push(transaction);
    this.totalsByCategory[transaction.category] += getSignedAmount(transaction);
  }

  isInPeriod = (isoDate) => {
    const isoStart = this.startDate.toISOString();
    const isoEnd = this.endDate.toISOString();
    return isoDate >= isoStart && isoDate < isoEnd;
  }

  getRelativePeriod = (date) => {
    if (typeof (date) === 'string') date = Period.isoToDate(date);
    const diff = Period.getPeriodTypeDiff(this.startDate, date);
    const offset = Math.ceil(diff / this.rangeCount);
    const period = this.getOffsetPeriod(offset);
    return period;
  }

  getOffsetPeriod = (offset) => {
    return new Period(
      this.startDate, offset, this.rangeType, this.rangeCount,
    );
  }

  // eslint-disable-next-line arrow-body-style
  getCategorySums = (categories) => {
    const transactions = this.getCategoryTransactions(categories);
    return this.getPeriodTransactionsSummary(transactions);
  }

  getCategoryTransactions = (categories) => {
    // eslint-disable-next-line array-callback-return
    return categories.reduce((trans, category) => {
      const { collection } = Transaction;
      const transactions = collection.get('byCategory', { category: category.name });
      return trans.concat(transactions);
    }, []);
  }

  getPeriodTransactions = (transactions) => {
    return transactions.filter((t) => t.date >= this.startDate && t.date < this.endDate);
  }

  getPeriodTransactionsSummary = (transactions) => {
    return transactions.reduce((total, t) => {
      return total + (this.isInPeriod(t.isoDate) ? +t.signedAmount : 0);
    }, 0);
  }

  static getPeriodList(startPeriod, isoEndDate) {
    let period = startPeriod;
    const periodList = [startPeriod];
    while (period.isoEndDate < isoEndDate) {
      const nextPeriod = period.getOffsetPeriod(1);
      periodList.push(nextPeriod);
      period = nextPeriod;
    }
    return periodList;
  }

  static getPeriodDiff = (periodA, periodB) => {
    return Math.ceil(
      Period.getPeriodTypeDiff(periodA.startDate, periodB.startDate) / periodA.rangeCount,
    );
  }

  static getPeriodTypeDiff = (date1, date2) => {
    // currently enabled only for Months
    const months = date2.getMonth() - date1.getMonth();
    const years = date2.getFullYear() - date1.getFullYear();
    let diff = months + years * 12;
    diff += date2.getDate() < date1.getDate() ? -1 : 0;

    return diff || 0;
  }

  static isoToDate = (isoString) => {
    const isoArray = isoString.split('-');
    return new Date(isoArray[0], isoArray[1] - 1, isoArray[2]);
  }

  static organizeTransactionsIntoPeriods(periods, transactions, aPeriod) {
    // return a hash of al periods keyed on startdate in iso format
    periods = periods || {};
    let aStartDate = aPeriod.startDate.toISOString();
    if (!periods[aStartDate]) periods[aStartDate] = aPeriod;
    transactions.forEach((transaction) => {
      // Get the period this date is in (this will be more efficient if the
      // transactions are in date order)
      if (!aPeriod.isInPeriod(transaction.date)) {
        aPeriod = aPeriod.getRelativePeriod(Period.isoToDate(transaction.date));
        aStartDate = aPeriod.startDate.toISOString();
        if (!periods[aStartDate]) periods[aStartDate] = aPeriod;
        else aPeriod = periods[aStartDate];
      }
      aPeriod.addTransaction(transaction);
    });

    return periods;
  }
}

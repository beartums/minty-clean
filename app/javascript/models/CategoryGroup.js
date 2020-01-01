/* eslint-disable class-methods-use-this */
import _ from 'lodash';
import CollectionManager from './CollectionManager';
import Category from './Category';
import Transaction from './Transaction';
import { Settings, KEYS } from '../services/settings';

class CategoryGroup {
  static collection

  static indices = [
    { name: 'byId', properties: 'id', isCollection: false },
    { name: 'byName', properties: 'name', isCollection: false },
  ]

  constructor(categoryGroup) {
    if (!CategoryGroup.collection) this.createCollection();
    this._name = categoryGroup.name;
    this._id = categoryGroup.id;
    CategoryGroup.collection.push(this);
  }

  set configuration(configuration) {
    this._configuration = configuration;
  }

  get configuration() {
    return this._configuration;
  }

  get id() { return this._id; }

  set id(id) {
    const oldId = this._id;
    this._id = id;
    this.reindex(this, oldId);
  }

  get name() { return this._name; }

  set name(name) { this._name = name; this.reindex(this); }

  get categories() {
    if (this._id < 0) return this.getUngroupedCategories();
    const cats = Category.collection ? Category.collection.get('byGroupId', { groupId: this.id }) : [];
    return cats || [];
  }

  get collection() { return CategoryGroup.collection; }

  getUngroupedCategories() {
    const { startDate } = Settings.get(KEYS.PERIODS.FIRST_PERIOD);
    let transCats = Transaction.collection.getKeys('byCategory');
    transCats = transCats.filter((cat) => {
      const transactions = Transaction.collection.get('byCategory', { category: cat });
      return transactions.some((trans) => trans.date >= startDate);
    });
    const groupCats = Category.collection.getKeys('byName');
    const cats = _.difference(transCats, groupCats).map((cat) => ({ name: cat }));
    return cats || [];
  }

  createCollection() {
    CategoryGroup.collection = new CollectionManager('CategoryGroup', 'id', 'CategoryGroups');
    CategoryGroup.collection.addIndices(CategoryGroup.indices);
  }

  reindex(item) {
    CategoryGroup.collection.reindex(item);
  }
}

export default CategoryGroup;

import _ from 'lodash';
import { Sorter } from './Sorter';

class CollectionManager {
  items = [];

  itemsHash = {};

  clonesHash = {};

  itemType = '';

  itemTypePlural = '';

  itemTypeDescription = '';

  indices = {};

  delim = '~/~';

  // TODO: Add  indexing of arrays within items (and objects within items)

  constructor(itemType, itemIdProp, itemTypePlural) {
    this.itemType = itemType;
    this.itemIdProp = itemIdProp;
    this.itemTypePlural = itemTypePlural || `${itemType}s`;
    this.sorter = new Sorter();
  }

  push(item) {
    if (this.itemsHash[item[this.itemIdProp]]) this.removeItemById(item[this.itemIdProp]);
    this.items.push(item);
    this.itemsHash[item[this.itemIdProp]] = item;
    this.clonesHash[item[this.itemIdProp]] = _.cloneDeep(item);
    this.addItemToAllIndices(item);
  }

  remove(item) {
    this.removeItemById(item[this.itemIdProp]);
  }

  removeItemById(itemId) {
    const item = this.clonesHash[itemId];
    if (item) {
      this.removeItemFromAllIndices(item, itemId);
      delete this.itemsHash[itemId];
      delete this.clonesHash[itemId];
      const idx = this.getIndexOfByItemIdProp(this.items, item);
      if (idx >= 0) this.items.splice(idx, 1);
    }
  }

  addIndex(name, properties, isCollection) {
    properties = properties.length === 'Array' ? properties : [properties];
    // eslint-disable-next-line object-curly-newline
    this.indices[name] = { name, properties, isCollection, items: {} };
    this.addAllItemsToIndex(name);
  }

  addIndices(indices) {
    indices.forEach((index) => {
      this.addIndex(index.name, index.properties, index.isCollection);
    });
  }

  addAllItemsToIndex(indexName) {
    const index = this.indices[indexName];
    this.items.forEach((item) => {
      this.addItemToIndex(item, index);
    });
  }

  addItemToIndex(item, index) {
    const key = this.getItemIndexKey(item, index);
    if (index.isCollection) {
      if (index.items[key]) index.items[key].push(item);
      else index.items[key] = [item];
    } else {
      index.items[key] = item;
    }
  }

  addItemToAllIndices(item) {
    this.getAllIndices().forEach((index) => {
      this.addItemToIndex(item, index);
    });
  }

  // eslint-disable-next-line no-unused-vars
  removeItemFromIndex(item, index, itemId) {
    const key = this.getItemIndexKey(item, index);
    if (!index.isCollection) {
      delete index.items[key];
    } else {
      const idx = this.getIndexOfByItemIdProp(index.items[key], item);
      if (idx >= 0) index.items[key].splice(idx, 1);
    }
  }

  getIndexOfByItemIdProp(array, item) {
    if (!item || !array || !array.length) return -1;
    const id = item[this.itemIdProp];
    const foundItem = array.find((el) => el[this.itemIdProp] === id);
    return !foundItem ? -1 : array.indexOf(foundItem);
  }

  removeItemFromAllIndices(item, itemId) {
    const indices = Object.keys(this.indices).map((key) => this.indices[key]);
    indices.forEach((index) => {
      this.removeItemFromIndex(item, index, itemId);
    });
  }

  getItemIndexKey(item, index) {
    const props = index.properties;
    return props.reduce((key, prop) => {
      key += key.length > 0 ? this.delim : '';
      key += item[prop];
      return key;
    }, '');
  }

  getItemById(id) {
    return this.itemsHash[id];
  }

  get(indexName, keyObject) {
    return this.getItemByIndex(indexName, keyObject);
  }

  getItemByIndex(indexName, keyObject) {
    const index = this.indices[indexName];
    const key = this.getItemIndexKey(keyObject, index);
    if (index.items[key]) return index.items[key];
    return index.isCollection ? [] : null;
  }

  getItemsByIndex(indexName, keyObject) {
    return this.getItemByIndex(indexName, keyObject);
  }

  getAllIndices() {
    return Object.keys(this.indices).map((key) => this.indices[key]);
  }

  getKeys(indexName) {
    const index = this.indices[indexName];
    if (!index) return [];
    const { items } = index;
    if (!items) return [];
    return Object.keys(items);
  }

  reindex(item, itemId) {
    itemId = itemId || item[this.itemIdProp];
    this.removeItemById(itemId);
    this.push(item);
  }
}

export default CollectionManager;

import _ from 'lodash'
import { SORT, Sorter } from './Sorter';

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
    this.itemTypePlural = itemTypePlural || itemType + 's';
    this.sorter = new Sorter()
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
    let item = this.itemsHash[itemId]
    if (item) {
      this.removeItemFromAllIndices(item,itemId)
      delete this.itemsHash[itemId];
      delete this.clonesHash[itemId];
      let idx = this.items.indexOf(item);
      if (idx) this.items.splice(idx,1);
    }
  }

  addIndex(name, properties, isCollection) {
    properties = typeof(properties)=='Array' ? properties : [properties]
    this.indices[name] = { name, properties, isCollection, items: {} };
    this.addAllItemsToIndex(name);
  }
  addIndices(indices) {
    indices.forEach( index => {
      this.addIndex(index.name, index.properties, index.isCollection);
    })
  }

  addAllItemsToIndex(indexName) {
    let index = this.indices[indexName];
    this.items.forEach( item => {
      this.addItemToIndex(item, index);
    });
  }

  addItemToIndex(item, index) {
    let key = this.getItemIndexKey(item, index);
    if (index.isCollection) {
      if (index.items[key]) index.items[key].push(item)
      else index.items[key] = [item];
    } else {
      index.items[key] = item;
    }
  }

  addItemToAllIndices(item) {
    this.getAllIndices().forEach( index => {
      this.addItemToIndex(item, index)
    })
  }

  removeItemFromIndex(item, index, itemObject) {
    let key = this.getItemIndexKey(item,index);
    if (!index.isCollection) {
      delete index.items[key];
    } else {
      index.items.splice(index.items[key].indexOf(itemObject),1)
    }
  }

  removeItemFromAllIndices(item, itemObject) {
    let indices = Object.keys(this.indices).map(key => this.indices[key]);
    indices.forEach( index => {
      this.removeItemFromIndex(item, index, itemObject)
    })
  }

  getItemIndexKey(item, index) {
    let props = index.properties;
    return props.reduce( (key, prop) => {
      key += key.length > 0 ? this.delim : '';
      key += item[prop];
      return key;
    },'')
  }

  getItemById(id) {
    return this.itemsHash[id];
  }

  get(indexName, keyObject) {
    return this.getItemByIndex(indexName, keyObject);
  }

  getItemByIndex(indexName,keyObject) {
    let index = this.indices[indexName];
    let key = this.getItemIndexKey(keyObject, index);
    return index.items[key];
  }
  getItemsByIndex(indexName,keyObject) {
    return this.getItemByIndex(indexName,keyObject);
  }

  getAllIndices() {
    return Object.keys(this.indices).map(key => this.indices[key]);
  }

  getKeys(indexName) {
    let index = this.indices[indexName];
    if (!index) return [];
    let items = index.items;
    if (!items) return [];
    return Object.keys(items);
  }

  reindex(item, itemId) {
    this.removeItemById(itemId);
    this.push(item)
  }

}

export default CollectionManager;
import _ from 'lodash'

class CollectionManager {
  items = [];
  itemsHash = {};
  itemClones = {};
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
  }

  push(item) {
    if (this.itemsHash[item[this.itemIdProp]]) this.removeById(item[this.itemIdProp]);
    this.items.push(item);
    this.itemsHash[item[this.itemIdProp]] = item;
    this.itemClones[item[this.itemIdProp]] = _.cloneDeep(item);
    this.addItemToAllIndices(item);
  }

  remove(item) {
    this.removeById(item[this.itemIdProp]);
  }

  removeById(itemId) {
    let item = this.itemsHash[itemId];
    if (item) {
      delete this.itemsHash[itemId];
      let idx = this.items.indexOf(item);
      if (idx) this.items.splice(idx,1);
    }
    this.removeItemFromAllIndices(item)
  }

  addIndex(name, properties, isCollection) {
    properties = typeof(properties)=='Array' ? properties : [properties]
    if (this.indices[name]) this.removeIndex(name);
    this.indices[name] = { name, properties, isCollection, items: {} };
    this.addAllItemsToIndex(name);
  }
  addIndices(indices) {
    indices.forEach( index => {
      this.addIndex(index.name, index.properties, index.isCollection);
    })
  }

  addAllItemsToIndex(indexName) {
    this.items.forEach( item => {
      this.addItemToIndex(item, indexName);
    });
  }

  addItemToIndex(item, indexName) {
    let index = this.indices[indexName];
    let key = this.getItemIndexKey(item, index);
    if (index.isCollection) {
      if (index.items[key]) index.items[key].push(item)
      else index.items[key] = [item];
    } else {
      index.items[key] = item;
    }
  }

  addItemToAllIndices(item) {
    let indexNames = Object.keys(this.indices);
    indexNames.forEach( indexName => {
      this.addItemToIndex(item, indexName)
    })
  }

  removeItemFromIndex(item, indexName) {
    let index = this.indices[indexName]
    let key = this.getItemIndexKey(item,index);
    if (!index.isCollection) {
      delete index.items[key];
    } else {
      index.items.splice(index.items[key].indexOf(item),1)
    }
  }

  removeItemFromAllIndices(item) {
    let indexNames = Object.keys(this.indices);
    indexNames.forEach( indexName => {
      this.removeItemFromIndex(item, indexName)
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

  }

  getItemByIndex(indexName,keyObject) {
    let index = this.indices[indexName];
    let key = this.getItemIndexKey(keyObject, index);
    return index.items[key];
  }
  getItemsByIndex(indexName,keyObject) {
    return this.getItemByIndex(indexName,keyObject);
  }

  reindexItem(item, item_id) {}

}

export default CollectionManager;
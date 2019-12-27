import CollectionManager from './CollectionManager';
import Category from './Category';
import Configuration from './Configuration';
import * as LocalSettingsService from '../services/localSettingsService';


class CategoryGroup {
  static collection
  static indices = [
    {name: "byId", properties: 'id', isCollection: false},
    {name: "byName", properties: 'name', isCollection: false},
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
  get configurationName() {
    if (!configuration) return ''
    return this._configuration.name ? this._configuration.name : '';
  }
  get id() { return this._id }
  set id(id) {
     let oldId = this._id; 
     this._id = id; 
     this.reindex(this, oldId) }

  get name() { return this._name }
  set name(name) { this._name = name; this.reindex(this) }

  get categories() {
    let cats = Category.collection ? Category.collection.get('byGroupId',{groupId:this.id}) : [];
    return cats || [];
  }

  get collection() { return CategoryGroup.collection }

  createCollection() {
    CategoryGroup.collection = new CollectionManager('CategoryGroup', 'id', 'CategoryGroups');
    CategoryGroup.collection.addIndices(CategoryGroup.indices);
  }

  // static saveConfiguration(name) {
  //   let config = this.collection.items.map( group => {
  //     let clone = _.cloneDeep(group);
  //     clone.categories.forEach( category => delete category.transactions);
  //   })
  //   LocalSettingsService.set(`config_${name}`, config);
  // }
  // static loadConfiguration(name) {
  //   let config = LocalSettingsService.get(`config_${name}`,[]);
  //   config.forEach( group => new CategoryGroup(group));
  // }
  
  reindex(item) {
    CategoryGroup.collection.reindex(this)
  }
}

export default CategoryGroup;

export class oldCategoryGroup {
  constructor(name, categories) {
    this.name = name;
    this.categories = categories;
  }
}
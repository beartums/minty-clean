import CollectionManager from './CollectionManager';
import Configuration from './Configuration';
import * as LocalSettingsService from '../services/localSettingsService';


class CategoryGroup {
  static CategoryGroups
  static indices = [
    {name: "byId", properties: 'id', isCollection: false},
    {name: "byName", properties: 'name', isCollection: false},
  ]

  constructor(categoryGroup) {
    if (!CategoryGroup.CategoryGroups) this.createCategoryGroups();
    this._name = categoryGroup.name;
    this._id = categoryGroup.id;
    this._categories = categoryGroup.categories || []
    CategoryGroup.CategoryGroups.push(categoryGroup);
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

  get collection() { return CategoryGroup.CategoryGroups }

  createCategoryGroups() {
    CategoryGroup.CategoryGroups = new CollectionManager('CategoryGroup', 'id', 'CategoryGroups');
    CategoryGroup.CategoryGroups.addIndices(CategoryGroup.indices);
  }

  static saveConfiguration(name) {
    let config = this.collection.items.map( group => {
      let clone = _.cloneDeep(group);
      clone.categories.forEach( category => delete category.transactions);
    })
    LocalSettingsService.set(`config_${name}`, config);
  }
  static loadConfiguration(name) {
    let config = LocalSettingsService.get(`config_${name}`,[]);
    config.forEach( group => new CategoryGroup(group));
  }
  
  reindex(item) {
    CategoryGroup.CategoryGroups.reindex(this)
  }
}

export default CategoryGroup;

export class oldCategoryGroup {
  constructor(name, categories) {
    this.name = name;
    this.categories = categories;
  }
}
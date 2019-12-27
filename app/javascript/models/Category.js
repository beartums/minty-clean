import CollectionManager from './CollectionManager';

class Category {
  static collection
  static indices = [
    {name: "byId", properties: 'id', isCollection: false},
    {name: "byGroupId", properties: 'groupId', isCollection: true},
    // {name: "byGroupName", properties: 'groupName', isCollection: true},
    {name: "byName", properties: 'name', isCollection: false},
    
  ]

  constructor(category) {
    if (!Category.collection) this.createCollection();
    this._name = category.category;
    this._id = category.id;
    this._groupId = category.categoryGroupId;
    
    Category.collection.push(this)
  }

  // set configuration(configuration) {
  //   this._configuration = configuration;
  // }
  // get configuration() {
  //   return this._configuration;
  // }
  // get configurationName() {
  //   if (!configuration) return ''
  //   return this._configuration.name ? this._configuration.name : '';
  // }

  get id() { return this._id }
  set id(id) {
     let oldId = this._id; 
     this._id = id; 
     this.reindex(this, oldId) }

  get name() { return this._name }
  set name(name) { this._name = name; this.reindex(this) }

  get groupId() { return this._groupId }
  set groupId(id) {
    this._groupId = id; this.reindex(this);
  }

  get category() { return this._name }
  get categoryGroupId() { return this._groupId }

  get collection() { return Category.collection }
 
  createCollection() {
    Category.collection = new CollectionManager('Category', 'id', 'Categories');
    Category.collection.addIndices(Category.indices);
  }

  reindex(item, originalId) {
    Category.collection.reindex(item, originalId)
  }
}

export default Category;
import CollectionManager from './CollectionManager';

class CategoryGroup {
  static CategoryGroups
  static indices = [
    {name: "byId", properties: 'id', isCollection: false},
    {name: "byName", properties: 'name', isCollection: false},
  ]
  name;
  id;
  categories = [];
  constructor(categoryGroup) {
    if (!CategoryGroup.CategoryGroups) this.createCategoryGroups();
    this.name = categoryGroup.name;
    this.id = categoryGroup.id;
    CategoryGroup.CategoryGroups.push(categoryGroup);
  }

  createCategoryGroups() {
    CategoryGroup.CategoryGroups = new CollectionManager('CategoryGroup', 'id', 'CategoryGroups');
    CategoryGroup.CategoryGroups.addIndices(CategoryGroup.indices);
  }

  getCategoryGroups() {
    return CategoryGroup.CategoryGroups;
  }
}

export default CategoryGroup;

export class oldCategoryGroup {
  constructor(name, categories) {
    this.name = name;
    this.categories = categories;
  }
}
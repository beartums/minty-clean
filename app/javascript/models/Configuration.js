export default class Configuration {
  categoryGroups = [];

  constructor(id, name, description) {
    this.id = id;
    this.name = name;
    this.description = description;
  }
  addGroup(categoryGroup) {
    this.categoryGroups.push(categoryGroup);
    this.categoryGroupsHash[categoryGroup.name] = categoryGroup;
  }
  removeGroup(categoryGroup) {
    let idx = this.categoryGroups.indexOf(categoryGroup);
    if (idx) this.categoryGroups.splice(idx,1);
    delete this.categoryGroupsHash[categoryGroup.name];
  }

}
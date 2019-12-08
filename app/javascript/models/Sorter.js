export const SORT = {
  DIRECTION: {
    ASCENDING: 'asc',
    DESCENDING: 'desc'
  }
}
export class SortField {
  constructor(name, sortRank, sortDirection, sortOn) {
    this.name = name;
    this.sortRank = sortRank
    this.sortDirection = sortDirection || 'asc';
    this.sortOn = sortOn // property to sort on
  }
}
export class Sorter {
  constructor(listToSort,SortFields) {
    this.listToSort = listToSort || [];
    this.SortFields = SortFields || [];
  }
  addSummary = (name, sortRank, sortDirection, sortOn) => {
    let sortField = new SortField(name, sortRank, sortDirection, sortOn);
    this.SortFields.push(sortField);
    return this; // for chaining
  }
  addSortField = (sortField) => {
    // TODO: error checking
    this.SortFields.push(sortField);
    return this; // for chaining
  }
  getRankedFields = () => {
    let fields = this.SortFields
            .filter( field => field.sortRank )
            .sort( (a,b) => a.sortRank<b.sortRank ? -1 : 1);
    return fields;
  }
  
  /**
   * Sort the list!
   *
   * @param {*} list {array<item>} Unsorted array of items to sort
   * @param {*} sortFields  {array<SortFields>} Array of sort prop definitions in priority order
   * @returns sorted list of items
   * @memberof Sorter
   */
  sortList(list, sortFields) {
    sortFields = sortFields || this.getRankedFields()
    list = list || this.listToSort;
    let sorters = this.getRankedFields();

    let sortedList = list.sort( (a, b) => {
      let rval = 0, i = 0;
      while (rval == 0 && i < sorters.length) {
        let sorter = sorters[i++];
        let valA = a[sorter.name], valB= b[sorter.name];
        rval = valA < valB ? -1 : (valA > valB ? 1 : 0);
        rval = rval * (sorter.sortDirection == SORT.DIRECTION.DESCENDING ? -1 : 1);
      }
      return rval;
    })
    return sortedList;
  }
}

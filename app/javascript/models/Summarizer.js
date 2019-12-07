export const SORT = {
  DIRECTION: {
    ASCENDING: 'asc',
    DESCENDING: 'desc'
  }
}
export class SummarizerField {
  constructor(name, sortRank, sortDirection, summarizeGroup, summarizeOn) {
    this.name = name;
    this.sortRank = sortRank
    this.sortDirection = sortDirection || 'asc';
    this.summarizeGroup = summarizeGroup || sortRank==true;
    this.summarizeOn = summarizeOn // field to summarize on
  }
}
export class Summarizer {
  constructor(listToSummarize,summarizerFields) {
    this.listToSummarize = listToSummarize || [];
    this.summarizerFields = summarizerFields || [];
  }
  addSummary = (name, sortRank, sortDirection, summarizeGroup, summarizeOn) => {
    let sumField = new SummarizerField(name, sortRank, sortDirection, summarizeGroup, summarizeOn);
    this.summarizerFields.push(sumField);
    return this; // for chaining
  }
  addSummarizerField = (sumField) => {
    // TODO: error checking
    this.summarizerFields.push(sumField);
    return this; // for chaining
  }
  getRankedFields = () => {
    let fields = this.summarizerFields
            .filter( field => field.sortRank )
            .sort( (a,b) => a.sortRank<b.sortRank ? -1 : 1);
    return fields;
  }
  getSortedList = (list) => {
    list = list || this.listToSummarize;
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

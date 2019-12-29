/* eslint-disable no-undef */
/* eslint-disable space-before-function-paren */
/* eslint-disable import/no-named-as-default */
// eslint-disable-next-line import/no-named-as-default-member
import CollectionManager from '../javascript/models/CollectionManager';

describe('The CollectionManager class', () => {
  let cm;
  beforeEach(() => {
    cm = new CollectionManager('Object', 'id', 'Objects');
    cm.addIndex('byId', ['id'], false);
    cm.addIndex('byColor', ['color'], true);
    cm.push({ id: 1, color: 'Green' });
    cm.push({ id: 2, color: 'Green' });
    cm.push({ id: 3, color: 'Blue' });
  });
  it('adds an object to an index', () => {
    expect(cm.get('byColor', { color: 'Green' }).length).toEqual(2);
    expect(cm.get('byColor', { color: 'Blue' }).length).toEqual(1);
  });
  it("reindexes if the id hasn't changed", () => {
    cm.reindex({ id: 1, color: 'Red' });
    expect(cm.get('byColor', { color: 'Green' }).length).toEqual(1);
    expect(cm.get('byColor', { color: 'Blue' }).length).toEqual(1);
    expect(cm.get('byColor', { color: 'Red' }).length).toEqual(1);
  });
  it('reindexes if the id has changed, as long as old id is passed', () => {
    cm.reindex({ id: 4, color: 'Red' }, 1);
    expect(cm.get('byColor', { color: 'Green' }).length).toEqual(1);
    expect(cm.get('byColor', { color: 'Blue' }).length).toEqual(1);
    expect(cm.get('byColor', { color: 'Red' }).length).toEqual(1);
    expect(cm.items.length).toEqual(3);
    expect(cm.get('byId', { id: 1 })).toBeFalsy();
    expect(cm.get('byId', { id: 2 })).toBeTruthy();
    expect(cm.itemsHash[4]).toBeTruthy();
    expect(cm.clonesHash[4]).toBeTruthy();
    expect(cm.get('byId', { id: 4 })).toBeTruthy();
  });
});

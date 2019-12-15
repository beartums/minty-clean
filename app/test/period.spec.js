import Period from '../javascript/models/Period';
describe("The Period class", function() {
  it("adds a period to the collection when instantiated", function() {
    new Period(new Date(),0,'m',1);
    expect(Period.collection.items.length).toEqual(1)
  });

  it("instantiates all periods between start and end when calling getPeriodList", function() {
    let pd = new Period("2019-08-06", 0, 'm', 1);
    let list = Period.getPeriodList(pd, '2019-12-05');

    expect(list.length).toEqual(4);
    expect(list[3].isoEndDate).toEqual('2019-12-06');
  })
});
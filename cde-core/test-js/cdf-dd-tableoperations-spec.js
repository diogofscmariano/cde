/**/
describe("Table Operations #", function() {

  var tableManager = undefined;
  var tableModel = undefined;
  var indexManager = undefined;

  /*Mock tableManager for testing*/
  var initTableManager = function(spyObjName) {
    var spyOnMethods = ['getSelectedCell', 'selectCell', 'getTableModel', 'getTableId', 'updateTreeTable'];
    tableManager = jasmine.createSpyObj(spyObjName, spyOnMethods);

    tableManager.selectCell.and.callFake(function(row,col){ tableManager.selectedCell = [row,col] });
    tableManager.getSelectedCell.and.callFake(function() { return tableManager.selectedCell; });
    tableManager.getTableModel.and.callFake(function() { return tableModel; });
  };

  /*Mock tableModel for testing*/
  var initTableModel = function(spyObjName) {
    var spyOnMethods = ['getEvaluatedId', 'getParentId', 'getRowType', 'getIndexManager', 'getData', 'setData'];
    tableModel = jasmine.createSpyObj(spyObjName, spyOnMethods);

    var rowType = function(row){return row.type};
    var parentId = function(row){ return row.parent; };
    tableModel.getIndexManager.and.callFake(function() { return indexManager; });
    tableModel.getEvaluatedId.and.callFake(function( rowNumber ) { return tableModel.getData()[rowNumber].id; });
    tableModel.getParentId.and.callFake(function() { return parentId; });
    tableModel.getRowType.and.callFake(function() { return rowType; });
    tableModel.getData.and.callFake(function() { return tableModel.data; });
    tableModel.setData.and.callFake(function(data) { tableModel.data = data; indexManager.updateIndex() });
  };

  var initIndexManager = function(tableModel) {
    indexManager = new IndexManager(tableModel);
    //indexManager.setIndex(rowIndex);
  };

  var populate = function(tableModel) {
    //Populate data for tableModel
    var rowData = [
      { 'id': 'first', 'parent': "UnIqEiD", 'type': "LayoutRow", properties: [{ 'name': "name", 'value': "first" }] },
      { 'id': 'first-child', 'parent': "first", 'type': "LayoutColumn", properties: [{ 'name': "name", 'value': "first-child" }] },
      { 'id': 'first-child-2', 'parent': "first", 'type': "LayoutColumn", properties: [{ 'name': "name", 'value': "first-child-2" }] },
      { 'id': 'first-child-2-child', 'parent': "first-child-2", 'type': "LayoutRow", properties: [{ 'name': "name", 'value': "first-child-2-child" }] },
      { 'id': 'second', 'parent': "UnIqEiD", 'type': "LayoutRow", properties: [{ 'name': "name", 'value': "second" }] }
    ];
    tableModel.setData(rowData);

  };

  //Helpers
  var getRowProperties = function( rowIndex ) { return tableModel.getData()[rowIndex].properties; };


  beforeEach(function(done){
    initTableManager('TableManager');
    initTableModel('TableModel');
    initIndexManager(tableModel);
    populate(tableModel, indexManager);
    done();
  });

  afterEach(function(done){
    tableManager = undefined;
    tableModel = undefined;
    indexManager = undefined;
    done();
  });

  /**
   * ## Table Operations # Duplicate Operation
   */
  it("Duplicate Operation - Row without children", function() {
    var duplicateOp = new DuplicateOperation();
    tableManager.selectCell(4,0);
    duplicateOp.execute(tableManager);

    expect(tableManager.getSelectedCell()[0] + "," + tableManager.getSelectedCell()[1]).toBe("4,0");
    expect(getRowProperties(0)[0].value).toBe('first');
    expect(getRowProperties(1)[0].value).toBe('first-child');
    expect(getRowProperties(2)[0].value).toBe('first-child-2');
    expect(getRowProperties(3)[0].value).toBe('first-child-2-child');
    expect(getRowProperties(4)[0].value).toBe('second_new');
    expect(getRowProperties(5)[0].value).toBe('second');
  });

  it("Duplicate Operation - Row with children", function() {
    var duplicateOp = new DuplicateOperation();
    tableManager.selectCell(0,0);
    duplicateOp.execute(tableManager);

    expect(tableManager.getSelectedCell()[0] + "," + tableManager.getSelectedCell()[1]).toBe("0,0");
    expect(getRowProperties(0)[0].value).toBe('first_new');
    expect(getRowProperties(1)[0].value).toBe('first-child_new');
    expect(getRowProperties(2)[0].value).toBe('first-child-2_new');
    expect(getRowProperties(3)[0].value).toBe('first-child-2-child_new');
    expect(getRowProperties(4)[0].value).toBe('first');
    expect(getRowProperties(5)[0].value).toBe('first-child');
    expect(getRowProperties(6)[0].value).toBe('first-child-2');
    expect(getRowProperties(7)[0].value).toBe('first-child-2-child');
    expect(getRowProperties(8)[0].value).toBe('second');
  });

  it("Duplicate Operation - Row with children and child of other row", function() {
    var duplicateOp = new DuplicateOperation();
    tableManager.selectCell(2,0);
    duplicateOp.execute(tableManager);

    expect(tableManager.getSelectedCell()[0] + "," + tableManager.getSelectedCell()[1]).toBe("2,0");
    expect(getRowProperties(0)[0].value).toBe('first');
    expect(getRowProperties(1)[0].value).toBe('first-child');
    expect(getRowProperties(2)[0].value).toBe('first-child-2_new');
    expect(getRowProperties(3)[0].value).toBe('first-child-2-child_new');
    expect(getRowProperties(4)[0].value).toBe('first-child-2');
    expect(getRowProperties(5)[0].value).toBe('first-child-2-child');
    expect(getRowProperties(6)[0].value).toBe('second');
  });

});
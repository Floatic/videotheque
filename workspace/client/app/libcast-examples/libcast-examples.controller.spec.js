'use strict';

describe('Controller: LibcastExamplesCtrl', function () {

  // load the controller's module
  beforeEach(module('videothequeApp'));

  var LibcastExamplesCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LibcastExamplesCtrl = $controller('LibcastExamplesCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

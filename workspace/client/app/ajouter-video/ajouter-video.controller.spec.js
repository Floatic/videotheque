'use strict';

describe('Controller: AjouterVideoCtrl', function () {

  // load the controller's module
  beforeEach(module('videothequeApp'));

  var AjouterVideoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AjouterVideoCtrl = $controller('AjouterVideoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

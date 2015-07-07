'use strict';

describe('Controller: ListeVideoCtrl', function () {

  // load the controller's module
  beforeEach(module('videothequeApp'));

  var ListeVideoCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ListeVideoCtrl = $controller('ListeVideoCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});

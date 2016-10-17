'use strict';

describe('Controller: EdituserCtrl', function () {

  // load the controller's module
  beforeEach(module('contratempoApp'));

  var EdituserCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EdituserCtrl = $controller('EdituserCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EdituserCtrl.awesomeThings.length).toBe(3);
  });
});

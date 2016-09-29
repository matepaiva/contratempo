'use strict';

describe('Controller: CounterdirectiveCtrl', function () {

  // load the controller's module
  beforeEach(module('contratempoApp'));

  var CounterdirectiveCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CounterdirectiveCtrl = $controller('CounterdirectiveCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CounterdirectiveCtrl.awesomeThings.length).toBe(3);
  });
});

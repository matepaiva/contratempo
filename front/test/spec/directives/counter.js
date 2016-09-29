'use strict';

describe('Directive: counter', function () {

  // load the directive's module
  beforeEach(module('contratempoApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<counter></counter>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the counter directive');
  }));
});
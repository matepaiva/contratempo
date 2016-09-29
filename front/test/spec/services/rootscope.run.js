'use strict';

describe('Service: rootscopeService', function () {

  // load the service's module
  beforeEach(module('contratempoApp'));

  // instantiate service
  var rootscopeService;
  beforeEach(inject(function (_rootscopeService_) {
    rootscopeService = _rootscopeService_;
  }));

  it('should do something', function () {
    expect(!!rootscopeService).toBe(true);
  });

});

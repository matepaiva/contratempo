'use strict';

describe('Service: tokenService', function () {

  // load the service's module
  beforeEach(module('contratempoApp'));

  // instantiate service
  var tokenService;
  beforeEach(inject(function (_tokenService_) {
    tokenService = _tokenService_;
  }));

  it('should do something', function () {
    expect(!!tokenService).toBe(true);
  });

});

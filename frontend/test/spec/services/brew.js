'use strict';

describe('Service: brew', function () {

  // load the service's module
  beforeEach(module('TeaLeavesApp'));

  // instantiate service
  var brew;
  beforeEach(inject(function (_brew_) {
    brew = _brew_;
  }));

  it('should do something', function () {
    expect(!!brew).toBe(true);
  });

});

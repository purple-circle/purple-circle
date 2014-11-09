describe('profile view', function() {
  beforeEach(function() {
    // TODO: change this
    browser.get('http://localhost:3000/profile/545f929b24e8d678b05a8e5c');

    browser.wait(function() {
      var deferred = protractor.promise.defer();
      element(by.css('p.username')).isPresent()
        .then(function (isPresent) {
          deferred.fulfill(!isPresent);
        });
      return deferred.promise;
    });

  });

  it('should have birthday visible', function() {
    expect(element(by.css('.fa-birthday-cake')).isPresent()).toBe(true);
  });

});
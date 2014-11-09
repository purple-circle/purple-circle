ddescribe('group view', function() {
  beforeEach(function() {
    // TODO: change this
    browser.get('http://localhost:3000/group/545fb2d14f928b02bce2b45f');

    browser.wait(function() {
      var deferred = protractor.promise.defer();
      element(by.css('h1.group-name')).isPresent()
        .then(function (isPresent) {
          deferred.fulfill(!isPresent);
        });
      return deferred.promise;
    });

  });

  it('should have group name visible', function() {
    expect(element(by.binding('group.name')).isPresent()).toBe(true);
  });

  it('should have user who created the group visible', function() {
    expect(element(by.binding('created_by.name')).isPresent()).toBe(true);
  });

  it('should have description', function() {
    expect(element(by.binding('group.description')).isPresent()).toBe(true);
  });

  it('should have created date visible', function() {
    expect(element(by.binding('group.created')).isPresent()).toBe(true);
  });

  it('should have category visible', function() {
    expect(element(by.binding('group.category')).isPresent()).toBe(true);
  });

});
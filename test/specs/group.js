describe('group view', function() {
  beforeEach(function() {
    // TODO: change this
    browser.get('http://localhost:3000/group/5460021bcd6e1c00009c3f9f');

    // This seems to leave the browser hanging
    browser.wait(function() {
      var deferred = protractor.promise.defer();
      element(by.css('.group-name')).isPresent()
        .then(function (isPresent) {
          deferred.fulfill(isPresent);
        });
      return deferred.promise;
    });

  });

  var login = function(group_id) {
    browser.get('http://localhost:3000/logout');
    browser.get('http://localhost:3000/login');
    element(by.model('login.username')).sendKeys('test');
    element(by.model('login.password')).sendKeys('test');

    var button = element(By.id('login-button'));
    button.click();

    browser.get('http://localhost:3000/group/' + group_id);
  };

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

  it('should not have edit link visible', function() {
    expect(element(by.css('.group-edit')).isPresent()).toBe(false);
  });

  it('should have edit link visible', function() {
    login("5461196563bef400007fb48d")
    console.log("this will keep the test from not failing, wtf", element(by.css('.group-edit')).isPresent())
    expect(element(by.css('.group-edit')).isPresent()).toBe(true);
  });

  it('should have edit link with text "edit"', function() {
    login("5461196563bef400007fb48d")
    console.log("this will keep the test from not failing, wtf", element(by.css('.group-edit')).isPresent())
    expect(element(by.css('.group-edit')).isPresent()).toBe(true);
    expect(element(by.css('.group-edit')).getText()).toBe("Edit");
  });

});
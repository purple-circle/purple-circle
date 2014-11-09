describe('grouplist view', function() {
  beforeEach(function() {
    browser.get('http://localhost:3000/logout');
    browser.get('http://localhost:3000/login');
    element(by.model('login.username')).sendKeys('test');
    element(by.model('login.password')).sendKeys('test');

    var button = element(By.id('login-button'));
    button.click();

    browser.get('http://localhost:3000/groups');
  });

  afterEach(function() {
    browser.get('http://localhost:3000/logout');
  });

  it('should create new group', function() {
    element
      .all(by.repeater('group in groups'))
      .count()
      .then(function(originalCount) {
        var groupName = 'juhq on ihq' + Math.ceil(Math.random() * 10000);

        element(by.model('data.name')).sendKeys(groupName);
        element(by.model('data.description')).sendKeys('juhq on ihq ja paras');

        var button = element(By.css('.save-group'));
        button.click();

        expect(element.all(by.repeater('group in groups')).count()).toBeGreaterThan(0);
        var groups = element.all(by.repeater('group in groups'))
        expect(groups.count()).toEqual(originalCount + 1);

        expect(groups.get(0).getText()).toContain(groupName);

        expect(element(by.model('data.name')).getAttribute('value')).toEqual('');
        expect(element(by.model('data.description')).getAttribute('value')).toEqual('');
      });
  });

  it('should have atleast one group on the list', function() {
    expect(element.all(by.repeater('group in groups')).count()).toBeGreaterThan(0);
  });
});
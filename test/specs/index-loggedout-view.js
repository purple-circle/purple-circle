describe('index logout view', function() {
  beforeEach(function() {
    browser.get('http://localhost:3000/logout');
    browser.get('http://localhost:3000/');
  });

  it('should have three some login buttons', function() {
    expect(element.all(by.css('.signup-buttons a')).count()).toEqual(3);
  });

  it('should have username and password fields', function() {
    expect(element.all(by.css('form input')).count()).toEqual(2);
  });

  it('should have atleast one user on the userlist', function() {
    expect(element.all(by.repeater('user in users')).count()).toBeGreaterThan(0);
  });
});
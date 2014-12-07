(function() {
  var error, faker, i, signup_data, success, user, _i;

  faker = require("faker");

  user = require("./models/user");

  for (i = _i = 0; _i <= 1; i = ++_i) {
    signup_data = {
      username: faker.internet.userName(),
      password: "test"
    };
    success = function(account) {
      var user_data, _ref;
      user_data = {
        name: faker.name.findName(),
        email: faker.internet.email(),
        birthday: faker.date.past(50),
        show_bio: Math.random() > 0.5,
        show_birthday: Math.random() > 0.5,
        gender: (_ref = Math.random() > 0.5) != null ? _ref : {
          "male": "female"
        },
        bio: faker.lorem.paragraphs(),
        picture_url: faker.image.imageUrl()
      };
      return user.edit(account._id, user_data).then(function(account) {
        return console.log("account data added", account);
      });
    };
    error = function(err) {
      return console.log("error", err);
    };
    user.localSignup(signup_data).then(success, error);
    console.log(i, "user", signup_data);
  }

}).call(this);

faker = require("faker")
user = require("./models/user")


for i in [0..10]
  signup_data =
    username: faker.internet.userName()
    password: "test"

  success = (account) ->
    user_data =
      name: faker.name.findName()
      email: faker.internet.email()
      birthday: faker.date.past(50)
      show_bio: Math.random() > 0.5
      show_birthday: Math.random() > 0.5
      gender: Math.random() > 0.5 ? "male" : "female"
      bio: "yolo"

    user
      .edit(account._id, user_data)
      .then (account) ->
        console.log "account data added", account

  error = (err) ->
    console.log "error", err

  user
    .localSignup(signup_data)
    .then success, error

  console.log i, "user", signup_data
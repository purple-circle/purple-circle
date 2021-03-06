faker = require("faker")
user = require("./models/user")


for i in [0..1]
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
      show_gender: Math.random() > 0.5
      gender: if Math.random() > 0.5 then "male" else "female"
      bio: faker.lorem.paragraphs()
      picture_url: faker.image.imageUrl()

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
//1
const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); //Hashing password package

//User Schema
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 8,
    max: 16,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    //Define User Roles
    type: String,
    enum: ["user", "admin"],
    required: true,
  },
  todos: [
    //Array of todos
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo", // Referece the todo model
    },
  ],
});

//Save the user into the database
//Hash the password before you save into the database
UserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) return next(err);
    this.password = passwordHash; //Now hash the password
    next(); //if password is hashed move on
  });
});

//Compare first and second password
UserSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    else {
      if (!isMatch) return cb(null, isMatch);
      return cb(null, this);
    }
  });
};

module.exports = mongoose.model("User", UserSchema);

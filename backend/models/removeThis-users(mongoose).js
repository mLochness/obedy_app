//const mongoose = require("mongoose");
const mysql = require("mysql");
const bcrypt = require("bcrypt");

const userSchema = new mysql.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

userSchema.methods.verifyPassword = async function (password) {
  const user = this;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch;
};

//const User = mongoose.model("User", userSchema);
//well.. no
const User = mysql.model("User", userSchema);

module.exports = User;
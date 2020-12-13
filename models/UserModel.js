const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserModelSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  grade: {
    type: Number,
    default: 0,
    required: true,
  },
  lastJwtToken: {
    type: String,
    required: false,
  },
  cryptoList: {
    type: String,
    required: false,
  },
});

UserModelSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  obj.userId = this._id;
  return obj;
};

const User = mongoose.model("User", UserModelSchema);
module.exports = User;

// Get User by email
module.exports.getUserByEmail = (_email) => {
  const query = { email: _email };
  return User.findOne(query).exec();
};

// Get User by id
module.exports.getUserById = (id) => {
  const query = { _id: id };
  return User.findOne(query).exec();
};

// Compare passpord and its hash
module.exports.comparePassword = function (userPassword, hash, callback) {
  bcrypt.compare(userPassword, hash, function (err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
};

// Set user's token
module.exports.setLastToken = (_email, lastJwtToken) => {
  const query = { email: _email };
  const newvalues = { $set: { lastJwtToken: lastJwtToken } };
  return User.updateOne(query, newvalues).exec();
};

// Set user's grade
// 0 - user lamda || 1 - admin
module.exports.setUserGrade = (_email, _grade) => {
  const query = { email: _email };
  const newvalues = { $set: { grade: _grade } };
  return User.updateOne(query, newvalues).exec();
};

// Update user info
module.exports.updateParams = (userId, email, lastname, firstname) => {
  const query = { _id: userId };
  const newvalues = {
    $set: { email: email, lastname: lastname, firstname: firstname },
  };
  return User.updateOne(query, newvalues).exec();
};

// Update cryptoList
module.exports.setCryptoList = (userId, crypto) => {
  console.log("new pseudo : " + crypto);
  const query = { _id: userId };
  const newvalues = { $set: { cryptoList: crypto } };
  return User.updateOne(query, newvalues);
};

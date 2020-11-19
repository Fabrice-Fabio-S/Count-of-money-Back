const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');

const UserModelSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        lastJwtToken: {
            type: String,
            required: false
        },
    },
);

UserModelSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    obj.userId = this._id;
    return obj;
};

const User = mongoose.model('User', UserModelSchema);
module.exports = User;

// Get User by email
module.exports.getUserByEmail = (_email) => {
    const query = {email: _email};
    return User.findOne(query).exec();
};

// Get User by id
module.exports.getUserById = (id) => {
    const query = {_id: id};
    return User.findOne(query).exec();
};

// Compare passpord and its hash
module.exports.comparePassword = function(userPassword, hash, callback){
    bcrypt.compare(userPassword, hash, function(err, isMatch) {
        if(err) throw err;
        callback(null, isMatch);
    });
};

// Set user's token
module.exports.setLastToken = (phoneNumber, lastJwtToken) => {
    const query = {phoneNumber: phoneNumber};
    const newvalues = { $set: {lastJwtToken: lastJwtToken } };
    return User.updateOne(query, newvalues).exec();
};

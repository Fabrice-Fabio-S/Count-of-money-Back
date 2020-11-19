const jwt                   = require('jsonwebtoken');
const bcrypt                = require('bcryptjs');
const UserModel             = require('./../models/UserModel');
const Utils                 = require('../config/Utils');
const randomstring          = require("randomstring");
const config                = require("../config/config");

require('dotenv').config();


const { body, check }   = require('express-validator/check');

module.exports = {

    // resgiter
    register: async (req, res) => {
        const { lastname, firstname, email, password} = req.body;

        console.log("lastname : "+lastname+" firstname : "+firstname+" email : "+email+" password : "+password);
        // Check email
        UserModel.getUserByEmail(email).then( user => {
            // if user with this email exists return 403
            if (user) {
                // user already exist
                return Utils.getJsonResponse(403, 'User already exist', {}, res);
            } else {
                const userInstance = new UserModel();
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, async (err, hash) => {
                        if (err) {
                            return Utils.getJsonResponse(404, 'Error hash pwd', {}, res);
                        } else {
                            userInstance.email = email;
                            userInstance.lastname = lastname;
                            userInstance.firstname = firstname;
                            userInstance.password = hash;
                            userInstance.save()
                                .then( result => {
                                    return Utils.getJsonResponse(200, '', userInstance, res);
                                })
                                .catch(e => {
                                    console.log('User not save ', e);
                                    return Utils.getJsonResponse(500, 'error', {}, res);
                                });
                        }
                    })
                });
            }
        });
    },

    // login
    login:  async (req, res) => {
        const {email, password} = req.body;

        UserModel.getUserByEmail(email)
            .then( user => {
                if(user) {
                    UserModel.comparePassword(password, user.password, function(err, isMatch) {
                        if (err) { return Utils.getJsonResponse(500,'Internal error', {}, res); }
                        if (isMatch) {
                            const token = jwt.sign(
                                { rdn: randomstring.generate({ length: 26, charset: 'alphanumeric'}) },
                                config.secret);

                            const data = {
                                email: user.email,
                                lastname: user.lastname,
                                firstname: user.firstname,
                                token: token,
                            };

                            UserModel.setLastToken(user.phoneNumber,token)
                                .then( result => {
                                    return Utils.getJsonResponse(200,'', data, res);})
                                .catch( err => {
                                    return Utils.getJsonResponse(404,'Can not set user token', {}, res);})
                        } else {
                            // Invalid password
                            return Utils.getJsonResponse(401,'Wrong Password', {}, res);
                        }
                    });
                }
                else {
                    // This email is not found
                    return Utils.getJsonResponse(404,'Email not exits', {}, res);
                }
            })
            .catch( err => {
                return Utils.getJsonResponse(500,'Internal error', {}, res);
            });
    },

};

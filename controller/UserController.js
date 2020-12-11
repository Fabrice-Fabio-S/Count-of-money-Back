const bcrypt                = require('bcryptjs');
const UserModel             = require('./../models/UserModel');
const Utils                 = require('../config/Utils');
const validator             = require("email-validator");
const passport = require("passport");
const randomstring = require("randomstring");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const url = require("url");

require('dotenv').config();

module.exports = {

    // resgiter
    register: async (req, res) => {
        const { lastname, firstname, email, password} = req.body;

        console.log("lastname : "+lastname+" firstname : "+firstname+" email : "+email+" password : "+password);
        // Check email
        if(validator.validate(email))
        {
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
        }
        else{
            return Utils.getJsonResponse(401,'Wrong Email format', {}, res);
        }
    },

    // login
    login:  async (req, res) => {
        passport.authenticate('local',
            { session: false},
            (err,user,info) => {
                if(err){
                    return Utils.getJsonResponse(500,err, {}, res);
                }
                if (info){
                    console.log(info.statusCode + " -> "+info.message);
                    return Utils.getJsonResponse(info.statusCode,info.message, {}, res);
                }
                else{
                    return Utils.getJsonResponse(200,'', user, res);
                }
            }
        )(req,res);
    },

    googleConnection: async (req,res)=>{
        console.log("step-1");
        passport.authenticate('google',
            {scope: ['profile','email']},
            (err,response)=>{
                console.log("User : "+response);
            }
        )(req,res);
    },

    googleCallback: async (req,res)=>{
        passport.authenticate('google',
            {scope: ['profile','email']},
            (err,response)=>{
                console.log("User : "+JSON.stringify(response,null,4));
                console.log("step-3 : "+response.displayName+ " "+response.emails[0].value);
                const token = jwt.sign(
                    { rdn: randomstring.generate({ length: 26, charset: 'alphanumeric'}) },
                    config.secret);

                const name= response.displayName;
                const email= response.emails[0].value;
                res.header('name', name);
                res.header('email', email);
                res.header('token', token);
                return res.redirect(
                    "http://localhost:3000?name="+name+"&email="+email+"&token="+token
                );
                // return Utils.getJsonResponse(200, '', data, res);

            }
        )(req,res);
        // return res.json({test: "test"})
    },

    // get userinfo
    getProfile: async (req,res)=>{
        const id = req.query.id;
        console.log("params : "+JSON.stringify(req.query,null,4));
        Utils.verifyToken(req,res,(err,tokenInfo)=>{
            if(err){
                return Utils.getJsonResponse(500,'Error token', {}, res);
            }
            else{
                UserModel.getUserById(id)
                    .then( user => {
                        console.log("user : "+id+" data : "+user);
                        return Utils.getJsonResponse(200,'', user, res);
                    })
                    .catch(err => {
                        return Utils.getJsonResponse(404,'User not found', {}, res);
                    })
            }
        });
    },

    // update user info
    updateUserInfo: async (req,res)=>{
        const {userId, email, lastname, firstname} = req.query;
        Utils.verifyToken(req,res,(err,tokenInfo)=>{
            if(err){
                return Utils.getJsonResponse(500,'Error token', {}, res);
            }
            else{
                UserModel.getUserByEmail(email)
                    .then( user => {
                    // if user with this email exists return 403
                    if (user) {
                        // user already exist
                        return Utils.getJsonResponse(403, 'User already exist', {}, res);
                    } else {
                        UserModel.updateParams(userId, email, lastname,firstname)
                            .then( result => {
                                console.log("id : "+userId+" lastname : "+lastname);
                                return Utils.getJsonResponse(200,'', {message: "User info has been update"}, res);
                            })
                            .catch(err => {
                                return Utils.getJsonResponse(404,'User not found', {}, res);
                            })
                    }
                });
            }
        });
    },

    // update crypto info
    updateCryptoList: async (req,res)=>{
        const {userId,crypto} = req.query;
        Utils.verifyToken(req,res,(err,tokenInfo)=>{
            if(err){
                return Utils.getJsonResponse(500,'Error token', {}, res);
            }
            else{
                UserModel.setCryptoList(userId,crypto)
                    .then( result => {
                        console.log(userId + ": crypto : "+crypto);
                        return Utils.getJsonResponse(200,'', {message: "Crypto list has been update"}, res);
                    })
                    .catch(err => {
                        return Utils.getJsonResponse(404,'User not found', {}, res);
                    })
            }
        });
    }

};

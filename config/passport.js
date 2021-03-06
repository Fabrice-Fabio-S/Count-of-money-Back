const UserModel = require("../models/UserModel");
const randomstring = require("randomstring");
const jwt = require("jsonwebtoken");
const config = require("./config");
const validator = require("email-validator");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      (email, password, done) => {
        if (validator.validate(email)) {
          UserModel.getUserByEmail(email)
            .then((user) => {
              if (user) {
                UserModel.comparePassword(
                  password,
                  user.password,
                  function (err, isMatch) {
                    if (err) {
                      console.log("err 1");
                      return done(err);
                    }
                    if (isMatch) {
                      const token = jwt.sign(
                        {
                          rdn: randomstring.generate({
                            length: 26,
                            charset: "alphanumeric",
                          }),
                        },
                        config.secret
                      );

                      const data = {
                        userId: user._id,
                        email: user.email,
                        lastname: user.lastname,
                        firstname: user.firstname,
                        token: token,
                        cryptoList: user.cryptoList,
                      };

                      console.log("data : " + JSON.stringify(data, null, 4));

                      UserModel.setLastToken(user.email, token)
                        .then((result) => {
                          return done(null, data);
                        })
                        .catch((err) => {
                          return done(null, false, {
                            statusCode: 404,
                            message: "Can not set user token",
                          });
                        });
                    } else {
                      // Invalid password
                      return done(null, false, {
                        statusCode: 401,
                        message: "Wrong Password",
                      });
                    }
                  }
                );
              } else {
                // This email is not found
                return done(null, false, {
                  statusCode: 404,
                  message: "Email not exits",
                });
              }
            })
            .catch((err) => {
              return done(null, false, {
                statusCode: 500,
                message: "Internal error",
              });
            });
        } else {
          return done(null, false, {
            statusCode: 401,
            message: "Wrong Email format",
          });
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });
  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL,
        passReToCallback: true,
      },
      function (request, accessToken, refreshToken, profile, done) {
        console.log("step-2 : " + JSON.stringify(profile, null, 4));
        return done(null, profile);
      }
    )
  );
};

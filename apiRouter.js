

const express                   = require('express');
const UserController             = require('./controller/UserController');


exports.router = (function() {
    const apiRouter = express.Router();

    apiRouter.route('/register').post(UserController.register);
    apiRouter.route('/login').post(UserController.login);
    apiRouter.route('/users/profil').get(UserController.getProfile);

    return apiRouter;
})();

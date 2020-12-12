

const express                   = require('express');
const UserController             = require('./controller/UserController');
const RssController = require("./controller/RssController");
const CryptoController = require("./controller/CryptoController");


exports.router = (function() {
    const apiRouter = express.Router();
    apiRouter.route('/register').post(UserController.register);
    apiRouter.route('/login').post(UserController.login);
    apiRouter.route('/users/profil').get(UserController.getProfile);
    apiRouter.route('/users/update/info').get(UserController.updateUserInfo);
    apiRouter.route('/users/update/crypto').get(UserController.updateCryptoList);
    apiRouter.route('/cryptos/:cmid/history/:period').get(CryptoController.sendCryptos);
    apiRouter.route('/cryptos/:cmid').get(CryptoController.fetchOne);
    apiRouter.route('/cryptos').get(CryptoController.fetch);

    apiRouter.route("/articles").get(RssController.getRssFeed);
    apiRouter.route('/auth/google/callback').get(UserController.googleCallback);
    apiRouter.route('/users/auth/google').get(UserController.googleConnection);
    apiRouter.route('/users/update/crypto').get(UserController.updateCryptoList);
    apiRouter.route('/users/update/info').get(UserController.updateUserInfo);
    apiRouter.route('/users/profil').get(UserController.getProfile);
    apiRouter.route('/login').post(UserController.login);
    apiRouter.route('/register').post(UserController.register);
    return apiRouter;
})();

const fetch = require("node-fetch");
const axios = require("axios");
const url = process.env.FINEX_URL;
const pathParams = "tickers";
const queryParams = "symbols=";
const express = require("express");
const Utils = require("../config/Utils");
const app = express();

function create_crypto(data) {
  let cryptos = [];
  data.forEach((array) => {
    let crypto = {};
    crypto.name = array.shift();
    if (crypto.name[0] === "t") {
      crypto.bid = array.shift();
      crypto.bid_size = array.shift();
      crypto.ask = array.shift();
      crypto.ask_size = array.shift();
      crypto.daily_change = array.shift();
      crypto.daily_change_relative = array.shift();
      crypto.last_price = array.shift();
      crypto.volume = array.shift();
      crypto.high = array.shift();
      crypto.low = array.shift();
    } else {
      crypto.frr = array.shift();
      crypto.bid = array.shift();
      crypto.bid_period = array.shift();
      crypto.bid_size = array.shift();
      crypto.ask = array.shift();
      crypto.ask_period = array.shift();
      crypto.ask_size = array.shift();
      crypto.daily_change = array.shift();
      crypto.daily_change_relative = array.shift();
      crypto.last_price = array.shift();
      crypto.volume = array.shift();
      crypto.high = array.shift();
      crypto.low = array.shift();
      array.shift();
      array.shift();
      crypto.frr_amount_available = array.shift();
    }
    cryptos.push(crypto);
  });
  return cryptos;
}

module.exports = {
  fetch: (req, res, next) => {
    try {
      let cryptos = req.body.params ? req.body.params : "ALL";
      console.log(`${url}/${pathParams}?${queryParams}${cryptos}`);
      axios
        .get(`${url}/${pathParams}?${queryParams}${cryptos}`)
        .then((data) => {
          let cryptos = create_crypto(data.data);
          return Utils.getJsonResponse(200, "", cryptos, res);
        })
        .catch((err) => {
          return Utils.getJsonResponse(403, "Cryptos not fetched", err, res);
        });
    } catch (err) {
      console.log(err);
      return Utils.getJsonResponse(403, "Cryptos not fetched", err, res);
    }
  },
};

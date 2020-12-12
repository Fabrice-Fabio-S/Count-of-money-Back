const fetch = require("node-fetch");
const axios = require("axios");
const url = process.env.FINEX_URL;
const pathParams = "tickers";
const queryParams = "symbols=";
const queryParamsAll = "symbols=ALL";
const express = require("express");
const Utils = require("../config/Utils");
const app = express();
const CryptoModel = require("./../models/CryptoModel");
const moment = require("moment");
const PERIOD = {
  DAILY: "daily",
  HOURLY: "hourly",
  MINUTE: "minute",
};

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

function save_cryptos(cryptos) {
  cryptos.forEach((obj) => {
    CryptoModel.create(obj);
  });
}

function fetch_crypto_by_period(name, period_amount, period_unit) {
  const oldestTimestamp = moment().subtract(period_amount, period_unit);
  try {
    return CryptoModel.find({
      name,
      createdAt: { $gt: oldestTimestamp },
    }).exec();
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  fetch: (req, res) => {
    try {
      let params = req.query.cmids;
      console.log(params);
      console.log(`${url}/${pathParams}?${queryParams}${params}`);
      axios
        .get(`${url}/${pathParams}?${queryParams}${params}`)
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
  fetchOne: (req, res, next) => {
    try {
      let cmid = req.params.cmid;
      let queryParams = cmid;
      let pathParams = "ticker";
      console.log(`${url}/${pathParams}/${queryParams}`);
      axios
        .get(`${url}/${pathParams}/${queryParams}`)
        .then((data) => {
          data.data.unshift(queryParams);
          let cryptos = create_crypto([data.data]);
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
  intervalFetchCryptos: (req, res, next) => {
    try {
      console.log(`${url}/${pathParams}?${queryParamsAll}`);
      axios
        .get(`${url}/${pathParams}?${queryParamsAll}`)
        .then((data) => {
          let cryptos = create_crypto(data.data);
          save_cryptos(cryptos);
          return;
        })
        .catch((err) => {
          console.log(err);
          return;
        });
    } catch (err) {
      console.log(err);
      return;
    }
  },
  sendCryptos: (req, res, next) => {
    try {
      let cmid = req.params.cmid;
      let period = req.params.period;
      let period_amount, period_unit;
      switch (period) {
        case PERIOD.HOURLY:
          period_amount = 48;
          period_unit = "hours";
          break;
        case PERIOD.DAILY:
          period_amount = 60;
          period_unit = "days";
          break;
        case PERIOD.MINUTE:
          period_amount = 2;
          period_unit = "hours";
          break;
      }
      console.log(cmid, period, period_amount, period_unit);
      fetch_crypto_by_period(cmid, period_amount, period_unit).then((data) => {
        console.log("data: " + data);
        return Utils.getJsonResponse(200, "", data, res);
      });
    } catch (err) {
      return Utils.getJsonResponse(403, "Crypto not fetched", err, res);
    }
  },
};

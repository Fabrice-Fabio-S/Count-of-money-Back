const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');

const CryptoModelSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        bid: {
            type: Number,
            required: true
        },
        bid_period: {
            type: Number,
            required: false
        },
        bid_size: {
            type: Number,
            required: true
        },
        ask: {
            type: Number,
            required: true
        },
        frr: {
            type: Number,
            required: false
        },
        ask_period: {
            type: Number,
            required: false
        },
        ask_size: {
            type: Number,
            required: true
        },
        daily_change: {
            type: Number,
            required: true
        },
        daily_change_relative: {
            type: Number,
            required: true
        },
        last_price: {
            type: Number,
            required: true
        },
        volume: {
            type: Number,
            required: true
        },
        high: {
            type: Number,
            required: true
        },
        low: {
            type: Number,
            required: true
        },
        frr_amount_available: {
            type: Number,
            required: false
        },
    }, { timestamps: true }
);

CryptoModelSchema.methods.toJSON = function() {
    const obj = this.toObject();
    return obj;
};

const Crypto = mongoose.model('Crypto', CryptoModelSchema);
module.exports = Crypto;



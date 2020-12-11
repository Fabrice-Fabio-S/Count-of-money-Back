
const express                   = require('express');
const apiRouter                 = require('./apiRouter').router;
const bodyParser                = require('body-parser');
const port = process.env.PORT || 3000;
const mongoose  = require('mongoose');
const passport = require("passport");
const app = express();
const cron = require('node-cron')
const CryptoController          = require("./controller/CryptoController");

require('dotenv').config();
require('./config/passport')(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

mongoose.connect( process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

const InitializePassport = require("./config/passport");
InitializePassport(passport);

app.use(passport.initialize());
app.use(passport.session());

app.get('/test', (req,res) => {
    res.send('test')
})

app.use('/api', apiRouter);

cron.schedule(
    '1,31 * * * * *',
    async () => {
        CryptoController.intervalFetchCryptos()
    }
)

app.listen(port,() => console.log(`Listen on : ${port}`));

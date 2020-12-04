
const express                   = require('express');
const apiRouter                 = require('./apiRouter').router;
const bodyParser                = require('body-parser');
const port = process.env.PORT || 3000;
const mongoose  = require('mongoose');
const passport = require("passport");
const cors = require("cors");
const app = express();

require('dotenv').config();
require('./config/passport')(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

//Définition des CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(cors());

mongoose.connect( process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

const InitializePassport = require("./config/passport");
const cookieSession = require('cookie-session')
InitializePassport(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2']
}))

app.get('/test', (req,res) => {
    res.send('test')
});

app.use('/api', apiRouter);

app.listen(port,() => console.log(`Listen on : ${port}`));

const express                   = require('express');
const bodyParser                = require('body-parser');
const port = process.env.PORT || 3000;
const mongoose  = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json());

const url = "mongodb+srv://epitech:epitech@cluster0.o59nf.mongodb.net/count-money?retryWrites=true&w=majority";

mongoose.connect( process.env.MONGO_DB_URL || url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

app.get('/test', (req,res) => {
    res.send('test')
})
app.listen(port,() => console.log(`Listen on : ${port}`));
const express = require('express');
const path = require('path');
const pool = require("./db");
const dotenv = require('dotenv').config();
const utf8 = require('utf8');
const bodyParser = require('body-parser');
const reg = require('./registration');

const {
  PORT: port = 3000,
} = process.env;
const app = express();

const errors = [];

app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); 

app.get("/", async (req, res) => {
  try {
    const allSignatures = await pool.query("SELECT * FROM signatures");
    utf8.decode(allSignatures);
    res.render('index', { data: allSignatures.rows });
  } catch (err) {
    console.error(err.message);
  }
});

app.post('/', async(req, res) => {
  try {
    const usrdata = req.body;
    const possibleerrors = await reg.register(usrdata);
    console.log(possibleerrors);
    const allSignatures = await pool.query("SELECT * FROM signatures");
    utf8.decode(allSignatures);
    res.render('index', { data: allSignatures.rows, errors: possibleerrors });
  } catch (err) {
    console.error(err.message);
  }
});

app.get('*', (req, res) => {
  res.render('error', { url: req.url });
});


app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});

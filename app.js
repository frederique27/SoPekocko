//Importation des modules
const express = require('express');
const bodyParser = require('body-parser'); //permet extraction d'objet JSON
const mongoose = require('mongoose');
const path = require('path');
const { expressShield } = require("node-shield"); //Aims in protecting Node.js applications againt OWASP Injection attacks.
const helmet = require("helmet"); //Helmet helps you secure your Express apps by setting various HTTP headers.
require('dotenv').config();

//Importation des routes
const sauceRoutes = require('./routes/sauce.routes');
const userRoutes = require('./routes/user.routes');

//Application express
const app = express();

//Connexion à MongoD
let mongoDB = process.env.MONGODB;
mongoose.connect(mongoDB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(helmet());

app.use(bodyParser.json());

app.use(expressShield({
  errorHandler: (shieldError, req, res, next) => {
    console.error(shieldError);
    res.sendStatus(400);
  },
}));

//Routes
app.use('/images', express.static(path.join(__dirname, 'images'))); //Chemin pour enregistrement des images
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app; 
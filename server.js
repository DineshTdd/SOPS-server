const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

// importing .env file configurations
dotenv.config();

const { mclient } = require('./db/mongoose.js');
const userRouter = require('./routes/user-routes');
const cardsRouter = require('./routes/cards-routes');

// connect to mongodb
mclient.mconnect();

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.get('/', (req, res) => res.send('SOPS API WORKING!'));
app.use('/user', userRouter);
app.use('/cards', cardsRouter);

// Configuring port
const port = process.env.PORT || 5000;

// Listening to the server
app.listen(port, () =>
  console.log(
    `${process.env.NODE_ENV} server up and running - ${process.env.HOST} - ${process.env.PORT}`,
  ),
);

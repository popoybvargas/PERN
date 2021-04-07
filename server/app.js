const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const router = require('./router');
const reviewsRouter = require('./reviewsRouter');

const app = express();

app.use(morgan('tiny'));
app.use(express.json(), express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/v1/restaurants', router);
app.use('/api/v1/reviews', reviewsRouter);

module.exports = app;
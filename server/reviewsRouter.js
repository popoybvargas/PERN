const express = require( 'express' );
const router = express.Router();

const db = require('./db');
const controller = require('./reviewsController');

router.get('/', controller.getAllReviews);
router.get('/:id', controller.getReview);
router.post('/', controller.createReview);

module.exports = router;
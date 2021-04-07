const express = require( 'express' );
const router = express.Router();

const db = require('./db');
const controller = require('./restaurantsController');

router.get('/', controller.getAllRestaurants);
router.get('/:id', controller.getRestaurant);
router.post('/', controller.createRestaurant);
router.put('/:id', controller.updateRestaurant);
router.delete('/:id', controller.deleteRestaurant);

module.exports = router;
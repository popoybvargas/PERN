const _ = require('zv-utils');

const db = require('./db');

const fields = [ 'name', 'location', 'price_range' ];

exports.getAllRestaurants = async (req, res, next) =>
{
	try
	{
		const { rows: restaurants } = await db.query('SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*) AS total_reviews, TRUNC(AVG(rating), 2) AS avg_rating FROM reviews GROUP BY restaurant_id) AS reviews ON restaurants.id = reviews.restaurant_id');
		
		res.status(200).json(
		{
			status: 'success',
			results: restaurants.length,
			data: { restaurants }
		});
	}
	catch (err) { console.log(err); }
};

exports.getRestaurant = async (req, res, next) =>
{
	try
	{
		const { id } = req.params;

		const { rows } = await db.query('SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*) AS total_reviews, TRUNC(AVG(rating), 2) AS avg_rating FROM reviews GROUP BY restaurant_id) AS reviews ON restaurants.id = reviews.restaurant_id WHERE id =$1', [ id ]);
		// const { rows } = await db.query('SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, name AS reviewer, review, rating FROM reviews) AS reviews ON restaurants.id = reviews.restaurant_id WHERE restaurants.id =$1', [ id ]);

		if (rows.length > 0)
		{
			const response = await db.query('SELECT * FROM reviews WHERE restaurant_id = $1', [ id ]);
			
			res.status(200).json(
			{
				status: 'success',
				data: { restaurant: { ...rows[0], reviews: response.rows } }
			});
		}
		else
		{
			res.status(400).json(
			{
				status: 'fail',
				message: '💥 Invalid ID'
			});
		}
	}
	catch (err) { console.log(err); }
};

exports.createRestaurant = async (req, res) =>
{
	try
	{
		const restaurant = _.pick(req.body, ...fields);

		const { rows } = await db.query('INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) RETURNING *', Object.values(restaurant));
		
		if (rows.length > 0)
		{	
			res.status(201).json(
			{
				status: 'success',
				data: { restaurant: rows[0] }
			});
		}
		else
		{
			res.status(500).json(
			{
				status: 'fail',
				message: 'Unable to insert data'
			});
		}
	}
	catch (err) { console.log(err); }
};

exports.updateRestaurant = async (req, res) =>
{
	try
	{
		const { id } = req.params;
		const updates = _.pick(req.body, ...fields);

		const { rows } = await db.query('UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 RETURNING *', [ ...Object.values(updates), id ]);
		
		if (rows.length > 0)
		{
			res.status(200).json(
			{
				status: 'success',
				data: { restaurant: rows[0] }
			});
		}
		else
		{
			res.status(500).json(
			{
				status: 'fail',
				message: 'Unable to update record'
			});
		}
	}
	catch (err) { console.log(err); }
};

exports.deleteRestaurant = async (req, res) =>
{
	try
	{
		const { id } = req.params;

		const { rowCount } = await db.query('DELETE FROM restaurants WHERE id = $1', [ id ]);
		
		if (rowCount > 0) res.status(204).json({ status: 'success' });
		else res.status(500).json(
		{
			status: 'fail',
			message: 'Unable to delete record'
		});
	}
	catch (err) { console.log(err); }
};
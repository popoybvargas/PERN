const _ = require('zv-utils');

const db = require('./db');

const fields = [ 'restaurant_id', 'name', 'rating', 'review' ];

exports.getAllReviews = async (req, res, next) =>
{
	try
	{
		const { rows: reviews } = await db.query('SELECT * FROM reviews');
		
		res.status(200).json(
		{
			status: 'success',
			results: reviews.length,
			data: { reviews }
		});
	}
	catch (err) { console.log(err); }
};

exports.getReview = async (req, res, next) =>
{
	try
	{
		const { id } = req.params;

		const { rows } = await db.query('SELECT * FROM reviews WHERE id = $1', [ id ]);

		if (rows.length > 0)
		{
			res.status(200).json(
			{
				status: 'success',
				data: { review: rows[0] }
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

exports.createReview = async (req, res) =>
{
	try
	{
		const review = _.pick(req.body, ...fields);

		const { rows } = await db.query('INSERT INTO reviews (restaurant_id, name, rating, review) VALUES ($1, $2, $3, $4) RETURNING *', Object.values(review));
		
		if (rows.length > 0)
		{	
			res.status(201).json(
			{
				status: 'success',
				data: { review: rows[0] }
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
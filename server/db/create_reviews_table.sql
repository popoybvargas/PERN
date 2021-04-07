CREATE TABLE reviews
(
	id BIGSERIAL NOT NULL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	restaurant_id BIGINT NOT NULL REFERENCES restaurants(id),
	review TEXT NOT NULL,
	rating INT NOT NULL CHECK(rating >= 1 AND rating <= 5)
);
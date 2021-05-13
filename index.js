const express = require('express');
const axios = require('axios');
const redis = require('redis');

const PORT = process.env.PORT || 5000;
const REDIS_PORT = process.env.REDIS_PORT || 6379;

const client = redis.createClient(REDIS_PORT);

const app = express();

const setReponse = (username, repos) => {
	return `<h2>${username} has ${repos} github repo`;
};

const getRepos = async (req, res, next) => {
	try {
		const { username } = req.params;
		const response = await axios.get(
			`https://api.github.com/users/${username}`,
		);
		const repos = response.data.public_repos;

		//cache to redis
		client.setex(username, 3600, repos);
		res.send(setReponse(username, repos));
	} catch (error) {
		console.error(error);
	}
};

//middleware
const cache = (req, res, next) => {
	const { username } = req.params;
	client.get(username, (err, data) => {
		if (err) throw err;
		if (data !== null) {
			res.send(setReponse(username, data));
		} else {
			next();
		}
	});
};

app.get('/repo/:username', cache, getRepos);

app.listen(PORT, () => {
	console.log(`listening on ${PORT}`);
});

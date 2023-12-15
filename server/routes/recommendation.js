const express = require("express");
const { auth } = require("../middleware/auth");
const axios = require("axios");
const config = require("../config/config");
const router = express.Router();

router.post("/recommend", auth, (req, res) => {
	const data = {
		title: "Inception",
		cast_ids: "[1, 2, 3]",
		cast_names: '["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"]',
		cast_chars: '["Cobb", "Arthur", "Ariadne"]',
		cast_bdays: '["1974-11-11", "1980-02-17", "1987-02-21"]',
		cast_bios: '["Bio1", "Bio2", "Bio3"]',
		cast_places: '["Place1", "Place2", "Place3"]',
		cast_profiles: '["Profile1", "Profile2", "Profile3"]',
		imdb_id: config.apiIMDB,
		poster: "https://example.com/poster.jpg",
		genres: '["Action", "Adventure", "Sci-Fi"]',
		overview: "A mind-bending action thriller",
		vote_average: "8.8",
		vote_count: "145632",
		rel_date: "2010-07-14",
		release_date: "2010-07-14",
		runtime: "148",
		status: "Released",
		rec_movies: '["Interstellar", "The Matrix", "Shutter Island"]',
		rec_posters:
			'["https://example.com/interstellar.jpg", "https://example.com/matrix.jpg", "https://example.com/shutterisland.jpg"]',
		rec_movies_org: '["Interstellar", "The Matrix", "Shutter Island"]',
		rec_year: "[2014, 1999, 2010]",
		rec_vote: "[8.6, 8.7, 8.1]",
	};
	axios
		.post("http://localhost:5000/recommend", req.data, {
			headers: {
				"Content-Type": "application/json",
			},
		})
		.then((pythonResponse) => {
			console.log("Python server response:", pythonResponse.data);
		})
		.catch((error) => {
			console.error("Error sending data to Python server:", error.message);
		});
});

module.exports = router;

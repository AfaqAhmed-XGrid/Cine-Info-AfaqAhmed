// Import Packges
const express = require('express');

// Import controllers
const { getAllMovies } = require('./movie.controller');

// Creating isntance
const router = express.Router();

// Api endpoint to get movies data
router.get('/getallmovies', getAllMovies);

module.exports = router;

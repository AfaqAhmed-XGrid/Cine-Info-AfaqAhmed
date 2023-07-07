// Packages imports
const mongoose = require('mongoose');

// Creating movie schema
const movieSchema = new mongoose.Schema({
  releaseDate: {
    type: Date,
  },
  title: {
    type: String,
  },
  productionBudget: {
    type: Number,
  },
  domesticGross: {
    type: Number,
  },
  worldWideGross: {
    type: Number,
  },
});

const Movie = new mongoose.model('Movie', movieSchema);

module.exports = Movie;

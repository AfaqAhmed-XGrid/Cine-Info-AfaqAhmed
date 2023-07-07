// Import package
const { default: to } = require('await-to-js');

// Import model
const Movie = require('./movie.model');

// Import constants
const movieConstants = require('./movie.constants');

// Import logger
const logger = require('../../config/logger/logger');

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @return {Object}
 */
const getAllMovies = async (req, res) => {
  logger.info(' Started getting movies data');

  const search = req.query.search || {};
  const searchQuery = req.query && req.query.search ? { title: { $regex: search, $options: 'i' } } : {};
  const pageNo = req.query.pageNo || 1;
  const limit = req.query.limit || 10;
  const skip = (pageNo - 1) * limit;

  const [err, movies] = await to(Movie.find(searchQuery).skip(skip).limit(limit));
  const [movieCountErr, movieCount] = await to(Movie.count(searchQuery));

  if (err) {
    logger.error('Failed to fetch the movies data', { error: err });
    return res.status(406).json({ success: 0, message: movieConstants.failure, data: null });
  };

  if (movieCountErr) {
    logger.error('Failed to fetch the movies total count', { error: movieCountErr });
    return res.status(406).json({ success: 0, message: movieConstants.failure, data: null });
  }

  if (movieCount === 0) {
    logger.info('No movie document found with the requested query params', { search, searchQuery, pageNo, limit, skip });
    return res.status(200).json({ success: 1, message: movieConstants.noMovieFoun1, data: { movies: null } });
  }

  if (movieCount < skip) {
    logger.info('requested page number does not exists that is movieCount is less than skip', { movieCount, skip });
    return res.status(200).json({ success: 1, message: movieConstants.pageNotFound, data: { movies: null } });
  }

  logger.info('Movies data is fetched successfully');
  return res.status(200).json({ success: 1, message: movieConstants.success, data: { movies, movieCount } });
};

module.exports = { getAllMovies };

// Package imports
const csv = require('csv-parser');
const fs = require('fs');
const { default: to } = require('await-to-js');

// Movie Schema import
const Movie = require('./movie.model');

// logger import
const logger = require('../../config/logger/logger');

const seedMovies = async () => {
  logger.info('Started seeding movies');

  const [err, dbMoviesData] = await to(Movie.find());

  if (err) {
    logger.error('Error in checking movies data in db', { error: err });
    return;
  }

  if (dbMoviesData.length > 0) {
    logger.info('Movies data is already added in db');
    return;
  }

  const data = [];
  logger.info('Started reading movies data through csv file');

  fs.createReadStream('./assets/movies_data.csv')
      .pipe(csv({
        skipLines: 1,
        headers: ['releaseDate', 'title', 'productionBudget', 'domesticGross', 'worldWideGross'],
      }))
      .on('data', (moviedata) => {
        data.push({
          releaseDate: Date.parse(moviedata.releaseDate)|| null,
          title: moviedata.title || null,
          productionBudget: Number(moviedata.productionBudget) || null,
          domesticGross: Number(moviedata.domesticGross) || null,
          worldWideGross: Number(moviedata.worldWideGross) || null,
        });
      })
      .on('end', async () => {
        logger.info('Reading csv file is successfully completed. Now uploading data in db');

        const [uploadingMoviesErr, uploadedMoviesData] = await to(Movie.insertMany(data));

        if (uploadingMoviesErr) {
          logger.error('Error in uploading movies data in db', { error: uploadingMoviesErr });
          return;
        }

        logger.info('Uploaded movies data in db successfully');
        return;
      });
};

module.exports = seedMovies;

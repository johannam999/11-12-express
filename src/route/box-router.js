'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Box from '../model/box';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const boxRouter = new Router();

boxRouter.post('/api/boxes', jsonParser, (request, response, next) => {
  // logger.log(logger.INFO, 'POST - processing a request');
  if (!request.body.firstName) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return next(new HttpErrors(400, 'title is required'));
  }
  return new Box(request.body).save()
    .then((box) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(box);
    })
    .catch(next);
});

boxRouter.put('/api/boxes/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };
  return Box.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedBox) => {
      if (!updatedBox) {
        logger.log(logger.INFO, 'PUT responding with 404 status code');
        return next(new HttpErrors(404, 'note not found'));
      }
      logger.log(logger.INFO, 'PUT -  responding with a 200 status code');
      return response.json(updatedBox);
    })
    .catch(next);
});


boxRouter.get('/api/boxes/:id', (request, response, next) => {
  return Box.findById(request.params.id)
    .then((box) => { 
      if (!box) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!box)');
        return next(new HttpErrors(404, 'note not found'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(box);
    })
    .catch(next);
});

boxRouter.delete('/api/boxes/:id', (request, response, next) => {
  return Box.findByIdAndRemove(request.params.id)
    .then((box) => { 
      if (!box) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code - (!box)');
        return next(new HttpErrors(404, 'note not found'));
      }
      logger.log(logger.INFO, 'DELETE - responding with a 204 status code');
      return response.sendStatus(204);
    })
    .catch(next);
});

export default boxRouter;

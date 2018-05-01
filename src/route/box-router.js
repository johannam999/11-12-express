'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import Box from '../model/box';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const boxRouter = new Router();

boxRouter.post('/api/boxes', jsonParser, (request, response) => {
  logger.log(logger.INFO, 'POST - processing a request');
  if (!request.body.firstName) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return response.sendStatus(400);
  }
  if (!request.body.lastName) {
    logger.log(logger.INFO, 'Responding with a 400 error code');
    return response.sendStatus(400);
  }
  return new Box(request.body).save()
    .then((box) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(box);
    })
    .catch((error) => {
      logger.log(logger.ERROR, '__POST_ERROR__');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

boxRouter.get('/api/boxes/:id', (request, response) => {
  logger.log(logger.INFO, 'GET - processing a request');

  return Box.findById(request.params.id)
    .then((box) => { 
      if (!box) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - (!box)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(box);
    })
    .catch((error) => {
      if (error.message.toLowerCase().indexOf('cast to objectid failed') > -1) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        return response.sendStatus(404);
      }
      logger.log(logger.ERROR, '__GET_ERROR__ Returning a 500 status code');
      logger.log(logger.ERROR, error);
      return response.sendStatus(500);
    });
});

boxRouter.delete('/api/boxes/:id', (request, response) => {
  logger.log(logger.INFO, 'DELETE - processing a request');

  return Box.findById(request.params.id)
    .then((box) => { 
      if (!box) {
        logger.log(logger.INFO, 'DELETE - responding with a 404 status code - (!box)');
        return response.sendStatus(404);
      }
      logger.log(logger.INFO, 'DELETE - responding with a 204 status code');
      return response.sendStatus(204);
    })
    .catch((error) => { 
      if (error.message.toLowerCase().indexOf('cast to object id failed') > -1) {
        logger.log(logger.INFO, 'GET - responding with a 404 status code - objectId');
        logger.log(logger.VERBOSE, `Could not parse the specific object id ${request.params.id}`);
        return response.sendStatus(400);
      }
      return undefined;
    });
});

export default boxRouter;

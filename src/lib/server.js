'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import boxRoutes from '../route/box-router';
import loggerMiddleware from './logger-middleware';
import errorMiddleware from './error-middleware';

const app = express(); // assign express to app
let server = null;
app.use(loggerMiddleware);

app.use(boxRoutes);

app.all('*', (request, response) => { // all routes, catch all for anything not defined
  logger.log(logger.INFO, 'Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
});

app.use(errorMiddleware);

const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI) // connect mongodb, this is a PROMISE
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO, `Server is listening on port ${process.env.PORT}`);
      });
    });
};

const stopServer = () => { // this is a PROMISE
  return mongoose.disconnect() //  bc we have no control over how long it will take to shut down
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is off'); // we can add json.strigify here to see the error
      });
    });
};

// server turns on and off right after executing the test

export { startServer, stopServer };

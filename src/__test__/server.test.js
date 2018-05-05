'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Box from '../model/box';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/boxes`;

const pCreateMockBox = () => {
  return new Box({
    firstName: faker.lorem.words(10),
    lastName: faker.lorem.words(25),
    address: faker.lorem.words(40),
  }).save();// i get promise back a saved item
};

describe('api/boxes', () => {
  beforeAll(startServer);// this is a function but not envoking function
  afterAll(stopServer);
  afterEach(() => Box.remove({})); // delete database after testing done

  test('POST - it should respond with a 200 status', () => {
    const boxToPost = {
      firstName: faker.lorem.words(10),
      lastName: faker.lorem.words(25),
      address: faker.lorem.words(40),
    };
    return superagent.post(apiURL)
      .send(boxToPost)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.firstName).toEqual(boxToPost.firstName); 
        expect(response.body.lastName).toEqual(boxToPost.lastName);
        expect(response.body.address).toEqual(boxToPost.address);
        expect(response.body._id).toBeTruthy();
        expect(response.body.timestamp).toBeTruthy();
      });
  });
  test('POST - It should respond with a 400 status if no firstName', () => {
    const boxToPost = {
      firstName: faker.lorem.words(25),
    };
    return superagent.post(apiURL)
      .send(boxToPost)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('POST - It should respond with a 400 status if no lastName ', () => {
    const boxToPost = {
      lastName: faker.lorem.words(25),
    };
    return superagent.post(apiURL)
      .send(boxToPost)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  describe('GET /api/boxes', () => {
    test('should respond with 200 if there are no errors', () => {
      let boxToTest = null; 
      return pCreateMockBox()
        .then((box) => {
          boxToTest = box;
          return superagent.get(`${apiURL}/${box._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.firstName).toEqual(boxToTest.firstName);
          expect(response.body.lastName).toEqual(boxToTest.lastName);
          expect(response.body.address).toEqual(boxToTest.address);
        });
    });
    test('should respond with 404 if there is no box to be found', () => {
      return superagent.get(`${apiURL}/ThisIsAnInvalidId`)
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('PUT /api/boxes', () => {
    test('should update a box and return a 200 status code', () => {
      let boxToUpdate = null;
      return pCreateMockBox()
        .then((boxMock) => {
          boxToUpdate = boxMock;
          return superagent.put(`${apiURL}/${boxMock._id}`)
            .send({ firstName: 'this is Joanna' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.firstName).toEqual('this is Joanna');
          expect(response.body.lastName).toEqual(boxToUpdate.lastName);
          expect(response.body.address).toEqual(boxToUpdate.address);
          expect(response.body._id).toEqual(boxToUpdate._id.toString());
        });
    });
  });

  describe('DELETE /api/boxes/:id', () => {
    test('should respond with 200 if there are no errors', () => {
      return pCreateMockBox() 
        .then((box) => {
          return superagent.delete(`${apiURL}/${box._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(204);
          expect(response.body).toEqual({});
        });
    });
  });
});

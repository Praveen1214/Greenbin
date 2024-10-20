const request = require('supertest');
const express = require('express');
const pickupRouter = require('../routes/pickupGarbageRoute'); // Your route file
const PickupGarbage = require('../models/PickupGarbageModel');

const app = express();
app.use(express.json());
app.use('/', pickupRouter);

// Mock the PickupGarbage model
jest.mock('../models/PickupGarbageModel');

describe('Pickup Garbage Routes', () => {

  describe('POST /addpickupgarbage', () => {
    it('should add a new pickup garbage request (positive case)', async () => {
      const mockPickup = {
        userid: 'user123',
        location: 'Location A',
        garbagetypes: ['Plastic', 'Organic'],
        message: 'Please pick up by evening',
        status: 'pending',
        date: new Date(),
      };

      PickupGarbage.prototype.save.mockResolvedValue(mockPickup);

      const res = await request(app)
        .post('/addpickupgarbage')
        .send(mockPickup);

      console.log('Positive Case: Successfully added a new pickup garbage request.');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ status: 'Pickup garbage added successfully' });
    });

    it('should return 500 if adding pickup garbage fails (negative case)', async () => {
      const mockPickup = {
        userid: 'user123',
        location: 'Location A',
        garbagetypes: ['Plastic', 'Organic'],
        message: 'Please pick up by evening',
        status: 'pending',
        date: new Date(),
      };

      PickupGarbage.prototype.save.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/addpickupgarbage')
        .send(mockPickup);

      console.log('Negative Case: Failed to add pickup garbage - Database error.');

      expect(res.statusCode).toBe(500);
      expect(res.body.status).toBe('Error adding pickup garbage');
      expect(res.body.message).toBe('Database error');
    });
  });

  describe('GET /getallpickupgarbage', () => {
    it('should fetch all pickup garbage requests (positive case)', async () => {
      const mockPickups = [
        { userid: 'user123', location: 'Location A', garbagetypes: ['Plastic'], status: 'pending' },
        { userid: 'user124', location: 'Location B', garbagetypes: ['Organic'], status: 'completed' },
      ];

      PickupGarbage.find.mockResolvedValue(mockPickups);

      const res = await request(app).get('/getallpickupgarbage');

      console.log('Positive Case: Successfully fetched all pickup garbage requests.');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockPickups);
    });

    it('should return 400 if fetching pickup garbage fails (negative case)', async () => {
      PickupGarbage.find.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/getallpickupgarbage');

      console.log('Negative Case: Failed to fetch pickup garbage requests - Database error.');

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Database error');
    });
  });

  describe('GET /getbyuserid/:userid', () => {
    it('should fetch pickups for a specific user (positive case)', async () => {
      const mockPickups = [
        { userid: 'user123', location: 'Location A', garbagetypes: ['Plastic'], status: 'pending' },
      ];

      PickupGarbage.find.mockResolvedValue(mockPickups);

      const res = await request(app).get('/getbyuserid/user123');

      console.log('Positive Case: Successfully fetched pickups for user user123.');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockPickups);
    });

    it('should return 404 if no pickups found for a user (negative case)', async () => {
      PickupGarbage.find.mockResolvedValue([]);

      const res = await request(app).get('/getbyuserid/user123');

    //  console.log('Negative Case: No pickups found for user user123.');

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('No pickups found for this user.');
    });

    it('should return 500 if there is an internal server error (negative case)', async () => {
      PickupGarbage.find.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/getbyuserid/user123');

    //  console.log('Negative Case: Failed to fetch pickups for user user123 - Internal server error.');

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Internal server error');
    });
  });

  describe('POST /updateweights', () => {
    it('should update weights and calculate the total cost (positive case)', async () => {
      const mockPickup = {
        _id: 'pickup123',
        weights: { plastic: 10 },
        totalCost: 0,
        save: jest.fn().mockResolvedValue(true), // Mocking save method on the found object
      };
  
      // Mocking the findById method to return the mockPickup
      PickupGarbage.findById = jest.fn().mockResolvedValue(mockPickup);
  
      const res = await request(app)
        .post('/updateweights')
        .send({ pickupId: 'pickup123', weights: { plastic: 10, organic: 5 } });

     // console.log('Positive Case: Successfully updated weights and calculated total cost.');
  
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Weights updated and cost calculated successfully');
      expect(res.body.totalCost).toBe(3750); // Assuming 250 per kg, 15 kg total (10 + 5)
    });
  
    it('should return 404 if pickup request not found (negative case)', async () => {
      // Mocking findById to return null
      PickupGarbage.findById = jest.fn().mockResolvedValue(null);
  
      const res = await request(app)
        .post('/updateweights')
        .send({ pickupId: 'pickup123', weights: { plastic: 10, organic: 5 } });

     // console.log('Negative Case: Pickup request not found for pickupId pickup123.');
  
      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Pickup request not found');
    });
  
    it('should return 400 if invalid weights are provided (negative case)', async () => {
      const mockPickup = {
        _id: 'pickup123',
        weights: { plastic: 10 },
        totalCost: 0,
        save: jest.fn().mockResolvedValue(true), // Mocking save method on the found object
      };
  
      // Mocking findById to return a valid pickup request
      PickupGarbage.findById = jest.fn().mockResolvedValue(mockPickup);
  
      const res = await request(app)
        .post('/updateweights')
        .send({ pickupId: 'pickup123', weights: "invalid_weights" });

     // console.log('Negative Case: Invalid weights provided for pickupId pickup123.');
  
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Invalid weights provided');
    });
  
    it('should return 500 if updating weights fails (negative case)', async () => {
      // Mocking findById to throw an error
      PickupGarbage.findById = jest.fn().mockRejectedValue(new Error('Database error'));
  
      const res = await request(app)
        .post('/updateweights')
        .send({ pickupId: 'pickup123', weights: { plastic: 10, organic: 5 } });

     // console.log('Negative Case: Failed to update weights for pickupId pickup123 - Database error.');
  
      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Error updating weights');
    });
  });
  
});

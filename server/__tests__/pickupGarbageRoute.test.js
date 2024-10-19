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
    it('should add a new pickup garbage request', async () => {
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

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ status: 'Pickup garbage added successfully' });
    });

    it('should return 500 if adding pickup garbage fails', async () => {
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

      expect(res.statusCode).toBe(500);
      expect(res.body.status).toBe('Error adding pickup garbage');
      expect(res.body.message).toBe('Database error');
    });
  });

  describe('GET /getallpickupgarbage', () => {
    it('should fetch all pickup garbage requests', async () => {
      const mockPickups = [
        { userid: 'user123', location: 'Location A', garbagetypes: ['Plastic'], status: 'pending' },
        { userid: 'user124', location: 'Location B', garbagetypes: ['Organic'], status: 'completed' },
      ];

      PickupGarbage.find.mockResolvedValue(mockPickups);

      const res = await request(app).get('/getallpickupgarbage');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockPickups);
    });

    it('should return 400 if fetching pickup garbage fails', async () => {
      PickupGarbage.find.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/getallpickupgarbage');

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Database error');
    });
  });

  describe('GET /getbyuserid/:userid', () => {
    it('should fetch pickups for a specific user', async () => {
      const mockPickups = [
        { userid: 'user123', location: 'Location A', garbagetypes: ['Plastic'], status: 'pending' },
      ];

      PickupGarbage.find.mockResolvedValue(mockPickups);

      const res = await request(app).get('/getbyuserid/user123');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockPickups);
    });

    it('should return 404 if no pickups found for a user', async () => {
      PickupGarbage.find.mockResolvedValue([]);

      const res = await request(app).get('/getbyuserid/user123');

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('No pickups found for this user.');
    });

    it('should return 500 if there is an internal server error', async () => {
      PickupGarbage.find.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/getbyuserid/user123');

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Internal server error');
    });
  });

  describe('POST /updateweights', () => {
    it('should update weights and calculate the total cost', async () => {
      const mockPickup = {
        _id: 'pickup123',
        userid: 'user123',
        weights: { plastic: 10 },
        totalCost: 0,
        save: jest.fn().mockResolvedValue(true), // Mocking save method on the found object
      };

      PickupGarbage.findById.mockResolvedValue(mockPickup);

      const res = await request(app)
        .post('/updateweights')
        .send({ userId: 'pickup123', weights: { plastic: 10, organic: 5 } });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Weights updated and cost calculated successfully');
      expect(res.body.totalCost).toBe(3750); // Assuming 250 per kg, 15 kg total
    });

    it('should return 404 if booking not found', async () => {
      PickupGarbage.findById.mockResolvedValue(null);

      const res = await request(app)
        .post('/updateweights')
        .send({ userId: 'pickup123', weights: { plastic: 10, organic: 5 } });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Booking not found');
    });

    it('should return 500 if updating weights fails', async () => {
      PickupGarbage.findById.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/updateweights')
        .send({ userId: 'pickup123', weights: { plastic: 10, organic: 5 } });

      expect(res.statusCode).toBe(500);
      expect(res.body.message).toBe('Error updating weights');
    });
  });
});

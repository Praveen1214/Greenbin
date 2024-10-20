const request = require('supertest');
const express = require('express');
const requestRouter = require('../routes/RequestItemRoute'); // Assuming your route is saved here
const RequestItem = require('../models/RequestItem');

const app = express();
app.use(express.json());
app.use('/', requestRouter);

// Mock the RequestItem model
jest.mock('../models/RequestItem');

describe('Request Item Routes', () => {
  
  describe('GET /getallrequestitems/:contact', () => {
    it('should return 404 if no request items are found', async () => {
      RequestItem.find.mockResolvedValue([]);

      const res = await request(app).get('/getallrequestitems/1234567890');

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('req not found');
    });

    it('should return 500 if fetching request items fails', async () => {
      RequestItem.find.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/getallrequestitems/1234567890');

      expect(res.statusCode).toBe(500);
      expect(res.body.status).toBe('Error with fetch req');
      expect(res.body.message).toBe('Database error');
    });
  });

  describe('PUT /updaterequest/:id', () => {
    it('should return 500 if updating request item fails', async () => {
      RequestItem.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .put('/updaterequest/1')
        .send({ category: 'Updated Electronics', quantity: 20 });

      expect(res.statusCode).toBe(500);
      expect(res.body.status).toBe('Error with update req');
      expect(res.body.message).toBe('Database error');
    });
  });

  describe('DELETE /deleterequest/:id', () => {
    it('should return 400 if deleting request item fails', async () => {
      RequestItem.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

      const res = await request(app).delete('/deleterequest/1');

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('Error with delete req');
      expect(res.body.message).toBe('Database error');
    });
  });
});

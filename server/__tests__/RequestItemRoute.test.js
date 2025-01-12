const request = require('supertest');
const express = require('express');
const requestRouter = require('../routes/RequestItemRoute');
const RequestItem = require('../models/RequestItem');

const app = express();
app.use(express.json());
app.use('/', requestRouter);

jest.mock('../models/RequestItem');

describe('Request Item Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /getallrequestitems/:contact', () => {
    it('should return 200 and request items for a valid contact', async () => {
      const mockItems = [{ id: '1', category: 'Electronics', quantity: 10 }];
      RequestItem.find.mockResolvedValue(mockItems);

      const res = await request(app).get('/getallrequestitems/1234567890');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('req is fatched');
      expect(res.body.req).toEqual(mockItems);

      console.log('Positive Test: GET /getallrequestitems/:contact - Success');
    });

    it('should return 404 if no request items are found', async () => {
      RequestItem.find.mockResolvedValue([]);

      const res = await request(app).get('/getallrequestitems/1234567890');

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('req not found');

      console.log('Negative Test: GET /getallrequestitems/:contact - Not Found');
    });

    it('should return 500 if fetching request items fails', async () => {
      RequestItem.find.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/getallrequestitems/1234567890');

      expect(res.statusCode).toBe(500);
      expect(res.body.status).toBe('Error with fetch req');
      expect(res.body.message).toBe('Database error');

      console.log('Negative Test: GET /getallrequestitems/:contact - Server Error');
    });
  });

  describe('PUT /updaterequest/:id', () => {
    it('should return 200 if request item is updated successfully', async () => {
      const updatedItem = { id: '1', category: 'Updated Electronics', quantity: 20 };
      RequestItem.findByIdAndUpdate.mockResolvedValue(updatedItem);

      const res = await request(app)
        .put('/updaterequest/1')
        .send(updatedItem);

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('req updated');

      console.log('Positive Test: PUT /updaterequest/:id - Success');
    });

    it('should return 500 if updating request item fails', async () => {
      RequestItem.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .put('/updaterequest/1')
        .send({ category: 'Updated Electronics', quantity: 20 });

      expect(res.statusCode).toBe(500);
      expect(res.body.status).toBe('Error with update req');
      expect(res.body.message).toBe('Database error');

      console.log('Negative Test: PUT /updaterequest/:id - Server Error');
    });
  });

  describe('DELETE /deleterequest/:id', () => {
    it('should return 200 if request item is deleted successfully', async () => {
      RequestItem.findByIdAndDelete.mockResolvedValue({});

      const res = await request(app).delete('/deleterequest/1');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('req is deleted');

      console.log('Positive Test: DELETE /deleterequest/:id - Success');
    });

    it('should return 400 if deleting request item fails', async () => {
      RequestItem.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

      const res = await request(app).delete('/deleterequest/1');

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('Error with delete req');
      expect(res.body.message).toBe('Database error');

      console.log('Negative Test: DELETE /deleterequest/:id - Bad Request');
    });
  });
});
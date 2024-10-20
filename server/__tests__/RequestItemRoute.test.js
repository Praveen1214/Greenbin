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
  
  // Test for fetching request items by contact
  describe('GET /getallrequestitems/:contact', () => {
    it('should return 404 if no request items are found (negative case)', async () => {
      RequestItem.find.mockResolvedValue([]);

      const res = await request(app).get('/getallrequestitems/1234567890');

      console.log('Negative Test Case: No request items found for contact 1234567890.');

      expect(res.statusCode).toBe(404);
      expect(res.body.status).toBe('req not found');
    });

    it('should return 500 if fetching request items fails (negative case)', async () => {
      RequestItem.find.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/getallrequestitems/1234567890');

      console.log('Negative Test Case: Database error occurred while fetching request items for contact 1234567890.');

      expect(res.statusCode).toBe(500);
      expect(res.body.status).toBe('Error with fetch req');
      expect(res.body.message).toBe('Database error');
    });

    it('should fetch all request items successfully by contact (positive case)', async () => {
      const mockRequestItems = [
        { _id: '1', category: 'Electronics', quantity: 10 },
        { _id: '2', category: 'Clothing', quantity: 5 }
      ];

      RequestItem.find.mockResolvedValue(mockRequestItems);

      const res = await request(app).get('/getallrequestitems/1234567890');

      console.log('Positive Test Case: Successfully fetched request items for contact 1234567890.');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('req is fatched');
      expect(res.body.req).toEqual(mockRequestItems);
    });
  });

  // Test for updating a request by ID
  describe('PUT /updaterequest/:id', () => {
    it('should update request item successfully (positive case)', async () => {
      const mockUpdatedRequest = {
        _id: '1',
        category: 'Updated Electronics',
        quantity: 20
      };

      RequestItem.findByIdAndUpdate.mockResolvedValue(mockUpdatedRequest);

      const res = await request(app)
        .put('/updaterequest/1')
        .send({ category: 'Updated Electronics', quantity: 20 });

      console.log('Positive Test Case: Successfully updated request item with ID 1.');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('req updated');
    });

    it('should return 500 if updating request item fails (negative case)', async () => {
      RequestItem.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .put('/updaterequest/1')
        .send({ category: 'Updated Electronics', quantity: 20 });

      console.log('Negative Test Case: Failed to update request item with ID 1 - Database error.');

      expect(res.statusCode).toBe(500);
      expect(res.body.status).toBe('Error with update req');
      expect(res.body.message).toBe('Database error');
    });
  });

  // Test for deleting a request by ID
  describe('DELETE /deleterequest/:id', () => {
    it('should delete request item successfully (positive case)', async () => {
      RequestItem.findByIdAndDelete.mockResolvedValue({ _id: '1' });

      const res = await request(app).delete('/deleterequest/1');

      console.log('Positive Test Case: Successfully deleted request item with ID 1.');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('req is deleted');
    });

    it('should return 400 if deleting request item fails (negative case)', async () => {
      RequestItem.findByIdAndDelete.mockRejectedValue(new Error('Database error'));

      const res = await request(app).delete('/deleterequest/1');

      console.log('Negative Test Case: Failed to delete request item with ID 1 - Database error.');

      expect(res.statusCode).toBe(400);
      expect(res.body.status).toBe('Error with delete req');
      expect(res.body.message).toBe('Database error');
    });
  });

});

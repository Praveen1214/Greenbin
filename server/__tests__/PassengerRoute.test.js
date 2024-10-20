const request = require('supertest');
   const express = require('express');
   const passengerRouter = require('../routes/PassengerRoute');
   const Passengers = require('../models/Passenger');

   const app = express();
   app.use(express.json());
   app.use('/', passengerRouter);

   // Mock the Passenger model
   jest.mock('../models/Passenger');

   describe('Passenger Routes', () => {
     describe('POST /register', () => {
       it('should register a new passenger', async () => {
         const mockPassenger = {
           firstname: 'John',
           lastname: 'Doe',
           email: 'john@example.com',
           gender: 'Male',
           contact: '1234567890',
         };

         Passengers.prototype.save.mockResolvedValue(mockPassenger);

         const res = await request(app)
           .post('/register')
           .send(mockPassenger);

         expect(res.statusCode).toBe(200);
         expect(res.body).toEqual({ status: "Passenger is registered successfully" });
       });

       it('should return 500 if registration fails', async () => {
         const mockPassenger = {
           firstname: 'John',
           lastname: 'Doe',
           email: 'john@example.com',
           gender: 'Male',
           contact: '1234567890',
         };

         Passengers.prototype.save.mockRejectedValue(new Error('Database error'));

         const res = await request(app)
           .post('/register')
           .send(mockPassenger);

         expect(res.statusCode).toBe(500);
         expect(res.body.status).toBe("Error with register passenger");
       });
     });

     describe('POST /login', () => {
       it('should login a passenger successfully', async () => {
         const mockPassenger = {
           _id: '123',
           firstname: 'John',
           lastname: 'Doe',
           email: 'john@example.com',
           gender: 'Male',
           contact: '1234567890',
           role: 'passenger',
         };

         Passengers.findOne.mockResolvedValue(mockPassenger);

         const res = await request(app)
           .post('/login')
           .send({ contact: '1234567890' });

         expect(res.statusCode).toBe(200);
         expect(res.body.status).toBe("Login Success");
         expect(res.body.loginPassenger).toEqual(mockPassenger);
       });

       it('should return 500 if login fails', async () => {
         Passengers.findOne.mockResolvedValue(null);

         const res = await request(app)
           .post('/login')
           .send({ contact: '1234567890' });

         expect(res.statusCode).toBe(500);
         expect(res.body.status).toBe("The contact is incorrect");
       });
     });

     describe('GET /getProfile/:userId', () => {
       it('should fetch user profile successfully', async () => {
         const mockProfile = {
           _id: '123',
           firstname: 'John',
           lastname: 'Doe',
           email: 'john@example.com',
           gender: 'Male',
           contact: '1234567890',
         };

         Passengers.findById.mockResolvedValue(mockProfile);

         const res = await request(app).get('/getProfile/123');

         expect(res.statusCode).toBe(200);
         expect(res.body).toEqual(mockProfile);
       });

       it('should return 404 if user not found', async () => {
         Passengers.findById.mockResolvedValue(null);

         const res = await request(app).get('/getProfile/123');

         expect(res.statusCode).toBe(404);
         expect(res.body.message).toBe('User not found');
       });

       it('should return 404 if user not found', async () => {
  Passengers.findById.mockResolvedValue(undefined);

  const res = await request(app).get('/getProfile/123');

  expect(res.statusCode).toBe(404);
  expect(res.body.message).toBe('User not found');
});
     });
   });
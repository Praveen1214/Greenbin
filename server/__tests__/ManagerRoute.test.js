const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const Manager = require('../models/Employees');
const managerRouter = require('../routes/Emp_route');

const app = express();
app.use(express.json());
app.use('/', managerRouter);

// Mock the Manager model
jest.mock('../models/Employees');

describe('Manager Routes', () => {
  describe('POST /addmanagers', () => {
    it('should create a new manager', async () => {
      const mockManager = {
        managerId: '12345',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        departmentId: 'IT001',
        phoneNumber: '1234567890',
        address: {
          addressLine: '123 Main St',
          province: 'Test Province',
          district: 'Test District',
          division: 'Test Division'
        },
        role: 'manager',
        status: 'active'
      };

      // Mock the findOne method to return null (no existing manager)
      Manager.findOne.mockResolvedValue(null);

      // Mock the save method to return the mockManager
      Manager.prototype.save = jest.fn().mockResolvedValue(mockManager);

      const res = await request(app)
        .post('/addmanagers')
        .send(mockManager);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('managerId', mockManager.managerId);
    });

    it('should return 400 if manager already exists', async () => {
      const mockManager = {
        email: 'existing@example.com',
        managerId: '12345'
      };

      Manager.findOne.mockResolvedValue(mockManager);

      const res = await request(app)
        .post('/addmanagers')
        .send(mockManager);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Manager with this email or managerId already exists');
    });
  });

  describe('GET /getallmanagers', () => {
    it('should return all managers', async () => {
      const mockManagers = [
        { name: 'John Doe', email: 'john@example.com' },
        { name: 'Jane Doe', email: 'jane@example.com' }
      ];

      Manager.find.mockResolvedValue(mockManagers);

      const res = await request(app).get('/getallmanagers');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveLength(2);
    });
  });

  describe('GET /managersbyid/:id', () => {
    it('should return a specific manager', async () => {
      const mockManager = { _id: '123', name: 'John Doe', email: 'john@example.com' };

      Manager.findById.mockResolvedValue(mockManager);

      const res = await request(app).get('/managersbyid/123');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockManager);
    });

    it('should return 404 if manager not found', async () => {
      Manager.findById.mockResolvedValue(null);

      const res = await request(app).get('/managersbyid/123');

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Manager not found');
    });
  });

  describe('POST /updatemanager/:id', () => {
    it('should update a manager', async () => {
      const mockManager = {
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        save: jest.fn().mockResolvedValue(true)
      };

      Manager.findById.mockResolvedValue(mockManager);

      const res = await request(app)
        .post('/updatemanager/123')
        .send({ name: 'Jane Doe' });

      expect(res.statusCode).toBe(200);
      expect(res.body.name).toBe('Jane Doe');
    });
  });

  describe('POST /togglemanagerstatus/:id', () => {
    it('should toggle manager status', async () => {
      const mockManager = {
        _id: '123',
        status: 'active',
        save: jest.fn().mockResolvedValue(true)
      };

      Manager.findById.mockResolvedValue(mockManager);

      const res = await request(app).post('/togglemanagerstatus/123');

      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('suspended');
    });
  });

  describe('DELETE /deletemanager/:id', () => {
    it('should delete a manager', async () => {
      Manager.findByIdAndDelete.mockResolvedValue({ _id: '123' });

      const res = await request(app).delete('/deletemanager/123');

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Manager deleted successfully');
    });
  });

  describe('POST /login', () => {
    it('should login a manager successfully', async () => {
      const mockManager = {
        managerId: '12345',
        name: 'John Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10),
        departmentId: 'IT001',
        phoneNumber: '1234567890',
        address: '123 Main St',
        role: 'manager'
      };

      Manager.findOne.mockResolvedValue(mockManager);

      const res = await request(app)
        .post('/login')
        .send({ email: 'john@example.com', password: 'password123' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('managerId', mockManager.managerId);
    });

    it('should return 400 if password is incorrect', async () => {
      const mockManager = {
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 10)
      };

      Manager.findOne.mockResolvedValue(mockManager);

      const res = await request(app)
        .post('/login')
        .send({ email: 'john@example.com', password: 'wrongpassword' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Login Failed: Incorrect Password');
    });

    it('should return 400 if manager not found', async () => {
      Manager.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/login')
        .send({ email: 'nonexistent@example.com', password: 'password123' });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Login Failed: Manager Not Found');
    });
  });
});
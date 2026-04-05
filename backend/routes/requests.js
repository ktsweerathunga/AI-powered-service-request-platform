import express from 'express';
import mongoose from 'mongoose';
import Request from '../models/Request.js';

const router = express.Router();

let fallbackRequests = [];

// Helper check
const isDbConnected = () => mongoose.connection.readyState === 1;

// GET all requests
router.get('/', async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json(fallbackRequests.sort((a, b) => b.createdAt - a.createdAt));
    }
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single request
router.get('/:id', async (req, res) => {
  try {
    if (!isDbConnected()) {
      const existing = fallbackRequests.find(r => r._id === req.params.id);
      if (!existing) return res.status(404).json({ message: 'Request not found' });
      return res.json(existing);
    }
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new request
router.post('/', async (req, res) => {
  try {
    const { title, description, location } = req.body;
    
    let savedRequest;

    if (!isDbConnected()) {
      savedRequest = {
        _id: Math.random().toString(36).substring(7),
        title,
        description,
        location,
        priority: 'WAITING_FOR_AI',
        category: 'WAITING_FOR_AI',
        status: 'NEW',
        createdAt: new Date(),
      };
      fallbackRequests.push(savedRequest);
    } else {
      const newRequest = new Request({
        title,
        description,
        location,
      });
      savedRequest = (await newRequest.save()).toObject();
    }

    // 2. Mock AI behavior for now
    setTimeout(async () => {
      const isCritical = Math.random() > 0.8; 
      const updates = {
        priority: isCritical ? 'CRITICAL' : 'MEDIUM',
        category: 'IT Support',
        ai_summary: "Simulated summary of the issue.",
        ai_suggested_resolution: "Simulated resolution: restart the device.",
      };
      
      if (isCritical) {
        updates.status = 'ASSIGNED'; 
      }

      let updatedRequest;
      if (!isDbConnected()) {
        const idx = fallbackRequests.findIndex(r => r._id === savedRequest._id);
        if (idx !== -1) {
          fallbackRequests[idx] = { ...fallbackRequests[idx], ...updates };
          updatedRequest = fallbackRequests[idx];
        }
      } else {
        updatedRequest = await Request.findByIdAndUpdate(savedRequest._id, updates, { new: true });
      }

      if (req.io && updatedRequest) {
        req.io.emit('requestUpdated', updatedRequest);
        if (isCritical) req.io.emit('criticalAlert', updatedRequest);
      }
    }, 2000);

    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update request status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    let updatedRequest;
    if (!isDbConnected()) {
      const idx = fallbackRequests.findIndex(r => r._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Request not found' });
      fallbackRequests[idx].status = status;
      updatedRequest = fallbackRequests[idx];
    } else {
      updatedRequest = await Request.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );
      if (!updatedRequest) return res.status(404).json({ message: 'Request not found' });
    }

    if (req.io) {
      req.io.emit('requestUpdated', updatedRequest);
    }

    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;

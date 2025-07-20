const express = require('express');
const Station = require('../models/Station');
const Train = require('../models/Train');
const AssistanceRequest = require('../models/AssistanceRequest');
const auth = require('../middleware/auth');

const router = express.Router();

// Get station information
router.get('/info', async (req, res) => {
  try {
    const station = await Station.findOne({ isActive: true });
    
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station information not found'
      });
    }

    res.json({
      success: true,
      station
    });

  } catch (error) {
    console.error('Station info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching station information',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get station facilities
router.get('/facilities', async (req, res) => {
  try {
    const { type } = req.query;
    const station = await Station.findOne({ isActive: true });
    
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    let facilities = station.facilities.filter(facility => facility.isActive);
    
    if (type) {
      facilities = facilities.filter(facility => facility.type === type);
    }

    res.json({
      success: true,
      facilities
    });

  } catch (error) {
    console.error('Facilities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching facilities',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get platform information
router.get('/platforms', async (req, res) => {
  try {
    const station = await Station.findOne({ isActive: true });
    
    if (!station) {
      return res.status(404).json({
        success: false,
        message: 'Station not found'
      });
    }

    const platforms = station.platforms.filter(platform => platform.isActive);

    res.json({
      success: true,
      platforms
    });

  } catch (error) {
    console.error('Platforms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching platforms',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get train schedules
router.get('/trains', async (req, res) => {
  try {
    const { platform, status, hours = 24 } = req.query;
    
    let query = { isActive: true };
    
    // Filter by platform if specified
    if (platform) {
      query.platform = platform;
    }
    
    // Filter by status if specified
    if (status) {
      query.status = status;
    }
    
    // Get trains within specified hours
    const now = new Date();
    const futureTime = new Date(now.getTime() + (parseInt(hours) * 60 * 60 * 1000));
    
    query.scheduledArrival = {
      $gte: now,
      $lte: futureTime
    };

    const trains = await Train.find(query)
      .sort({ scheduledArrival: 1 })
      .limit(50);

    res.json({
      success: true,
      trains,
      count: trains.length
    });

  } catch (error) {
    console.error('Trains error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching train schedules',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get specific train information
router.get('/trains/:trainNumber', async (req, res) => {
  try {
    const { trainNumber } = req.params;
    
    const train = await Train.findOne({ 
      trainNumber: trainNumber.toUpperCase(),
      isActive: true 
    });
    
    if (!train) {
      return res.status(404).json({
        success: false,
        message: 'Train not found'
      });
    }

    res.json({
      success: true,
      train
    });

  } catch (error) {
    console.error('Train info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching train information',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Request assistance
router.post('/assistance', auth, async (req, res) => {
  try {
    const {
      type,
      description,
      location,
      contactInfo,
      scheduledTime,
      priority = 'medium'
    } = req.body;

    // Validation
    if (!type || !description || !location || !location.current) {
      return res.status(400).json({
        success: false,
        message: 'Type, description, and current location are required'
      });
    }

    const assistanceRequest = new AssistanceRequest({
      user: req.user.userId,
      type,
      description,
      location,
      contactInfo,
      scheduledTime: scheduledTime ? new Date(scheduledTime) : undefined,
      priority
    });

    await assistanceRequest.save();
    await assistanceRequest.populate('user', 'name email');

    // Emit real-time notification to admin dashboard
    const io = req.app.get('io');
    if (io) {
      io.emit('new_assistance_request', {
        request: assistanceRequest,
        message: `New ${type} assistance request from ${assistanceRequest.user.name}`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Assistance request submitted successfully',
      request: assistanceRequest
    });

  } catch (error) {
    console.error('Assistance request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting assistance request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get user's assistance requests
router.get('/assistance/my-requests', auth, async (req, res) => {
  try {
    const { status, limit = 10 } = req.query;
    
    let query = { user: req.user.userId };
    
    if (status) {
      query.status = status;
    }

    const requests = await AssistanceRequest.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      requests
    });

  } catch (error) {
    console.error('My requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching assistance requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get navigation path between two points
router.post('/navigation', auth, async (req, res) => {
  try {
    const { from, to } = req.body;
    
    if (!from || !to || !from.x || !from.y || !to.x || !to.y) {
      return res.status(400).json({
        success: false,
        message: 'From and to coordinates (x, y) are required'
      });
    }

    // Simple pathfinding algorithm (A* would be better for complex layouts)
    const path = calculatePath(from, to);
    const distance = calculateDistance(from, to);
    const estimatedTime = Math.ceil(distance / 50); // Assuming 50 units per minute walking speed

    res.json({
      success: true,
      navigation: {
        from,
        to,
        path,
        distance: Math.round(distance),
        estimatedTime,
        instructions: generateInstructions(path)
      }
    });

  } catch (error) {
    console.error('Navigation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error calculating navigation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Admin routes (require admin role)
router.use('/admin', (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
});

// Get all assistance requests (admin only)
router.get('/admin/assistance', auth, async (req, res) => {
  try {
    const { status, type, priority } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (type) query.type = type;
    if (priority) query.priority = priority;

    const requests = await AssistanceRequest.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests
    });

  } catch (error) {
    console.error('Admin assistance requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching assistance requests',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update assistance request status (admin only)
router.put('/admin/assistance/:requestId', auth, async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, assignedStaff, note } = req.body;

    const request = await AssistanceRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Assistance request not found'
      });
    }

    if (status) {
      await request.updateStatus(status, note);
    }

    if (assignedStaff) {
      await request.assignStaff(assignedStaff);
    }

    await request.populate('user', 'name email');

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.emit('assistance_request_updated', {
        request,
        message: `Assistance request ${status || 'updated'}`
      });
    }

    res.json({
      success: true,
      message: 'Assistance request updated successfully',
      request
    });

  } catch (error) {
    console.error('Update assistance request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating assistance request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper functions
function calculatePath(from, to) {
  // Simple straight-line path for demo
  // In a real application, you'd implement A* or similar pathfinding
  const steps = 10;
  const path = [];
  
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    path.push({
      x: from.x + (to.x - from.x) * progress,
      y: from.y + (to.y - from.y) * progress
    });
  }
  
  return path;
}

function calculateDistance(from, to) {
  return Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2));
}

function generateInstructions(path) {
  if (path.length < 2) return ['You are already at your destination'];
  
  const instructions = ['Start from your current location'];
  
  // Simple instruction generation
  const start = path[0];
  const end = path[path.length - 1];
  
  if (end.x > start.x) {
    instructions.push('Head east');
  } else if (end.x < start.x) {
    instructions.push('Head west');
  }
  
  if (end.y > start.y) {
    instructions.push('Then head north');
  } else if (end.y < start.y) {
    instructions.push('Then head south');
  }
  
  instructions.push('You have arrived at your destination');
  
  return instructions;
}

module.exports = router;
const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema({
  trainNumber: {
    type: String,
    required: [true, 'Train number is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  trainName: {
    type: String,
    required: [true, 'Train name is required'],
    trim: true
  },
  source: {
    type: String,
    required: [true, 'Source station is required'],
    trim: true
  },
  destination: {
    type: String,
    required: [true, 'Destination station is required'],
    trim: true
  },
  platform: {
    type: String,
    required: [true, 'Platform is required'],
    trim: true
  },
  scheduledArrival: {
    type: Date,
    required: [true, 'Scheduled arrival time is required']
  },
  scheduledDeparture: {
    type: Date,
    required: [true, 'Scheduled departure time is required']
  },
  actualArrival: {
    type: Date
  },
  actualDeparture: {
    type: Date
  },
  status: {
    type: String,
    enum: ['On Time', 'Delayed', 'Cancelled', 'Departed', 'Arrived'],
    default: 'On Time'
  },
  delay: {
    type: Number,
    default: 0,
    min: 0
  },
  coaches: [{
    type: {
      type: String,
      enum: ['AC1', 'AC2', 'AC3', 'Sleeper', 'General', 'Chair Car'],
      required: true
    },
    number: {
      type: String,
      required: true
    },
    totalSeats: {
      type: Number,
      required: true
    },
    availableSeats: {
      type: Number,
      required: true
    }
  }],
  route: [{
    stationCode: {
      type: String,
      required: true
    },
    stationName: {
      type: String,
      required: true
    },
    arrivalTime: Date,
    departureTime: Date,
    platform: String,
    distance: Number,
    stopDuration: Number
  }],
  amenities: [{
    type: String,
    enum: ['WiFi', 'Catering', 'Pantry Car', 'AC', 'Charging Points', 'Reading Light']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  announcements: [{
    message: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    type: {
      type: String,
      enum: ['delay', 'platform_change', 'cancellation', 'general'],
      default: 'general'
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
trainSchema.index({ trainNumber: 1 });
trainSchema.index({ scheduledArrival: 1 });
trainSchema.index({ scheduledDeparture: 1 });
trainSchema.index({ platform: 1 });
trainSchema.index({ status: 1 });

// Virtual for current delay calculation
trainSchema.virtual('currentDelay').get(function() {
  if (this.actualArrival && this.scheduledArrival) {
    return Math.max(0, Math.floor((this.actualArrival - this.scheduledArrival) / (1000 * 60)));
  }
  return this.delay;
});

// Method to update train status
trainSchema.methods.updateStatus = function(newStatus, delay = 0) {
  this.status = newStatus;
  this.delay = delay;
  
  if (newStatus === 'Arrived' && !this.actualArrival) {
    this.actualArrival = new Date();
  }
  
  if (newStatus === 'Departed' && !this.actualDeparture) {
    this.actualDeparture = new Date();
  }
  
  return this.save();
};

// Method to add announcement
trainSchema.methods.addAnnouncement = function(message, type = 'general') {
  this.announcements.push({
    message,
    type,
    timestamp: new Date()
  });
  
  // Keep only last 10 announcements
  if (this.announcements.length > 10) {
    this.announcements = this.announcements.slice(-10);
  }
  
  return this.save();
};

// Static method to get trains by platform
trainSchema.statics.getTrainsByPlatform = function(platform) {
  return this.find({ 
    platform: platform,
    isActive: true,
    scheduledDeparture: { $gte: new Date() }
  }).sort({ scheduledArrival: 1 });
};

// Static method to get upcoming trains
trainSchema.statics.getUpcomingTrains = function(hours = 24) {
  const now = new Date();
  const futureTime = new Date(now.getTime() + (hours * 60 * 60 * 1000));
  
  return this.find({
    isActive: true,
    scheduledArrival: { 
      $gte: now,
      $lte: futureTime
    }
  }).sort({ scheduledArrival: 1 });
};

module.exports = mongoose.model('Train', trainSchema);
const mongoose = require('mongoose');

const assistanceRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  type: {
    type: String,
    required: [true, 'Assistance type is required'],
    enum: [
      'wheelchair',
      'elderly_assistance',
      'luggage_help',
      'medical_emergency',
      'lost_and_found',
      'information',
      'navigation',
      'accessibility',
      'other'
    ]
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  location: {
    current: {
      x: {
        type: Number,
        required: [true, 'Current X coordinate is required']
      },
      y: {
        type: Number,
        required: [true, 'Current Y coordinate is required']
      },
      description: {
        type: String,
        trim: true
      }
    },
    destination: {
      x: Number,
      y: Number,
      description: {
        type: String,
        trim: true
      }
    }
  },
  contactInfo: {
    phone: {
      type: String,
      trim: true
    },
    alternateContact: {
      type: String,
      trim: true
    },
    preferredContactMethod: {
      type: String,
      enum: ['phone', 'app', 'both'],
      default: 'app'
    }
  },
  scheduledTime: {
    type: Date
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 30
  },
  assignedStaff: {
    staffId: {
      type: String
    },
    name: {
      type: String
    },
    contact: {
      type: String
    },
    assignedAt: {
      type: Date
    }
  },
  notes: [{
    message: {
      type: String,
      required: true
    },
    addedBy: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isInternal: {
      type: Boolean,
      default: false
    }
  }],
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [300, 'Feedback comment cannot exceed 300 characters']
    },
    submittedAt: {
      type: Date
    }
  },
  completedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String,
    trim: true
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for efficient queries
assistanceRequestSchema.index({ user: 1 });
assistanceRequestSchema.index({ status: 1 });
assistanceRequestSchema.index({ type: 1 });
assistanceRequestSchema.index({ priority: 1 });
assistanceRequestSchema.index({ createdAt: -1 });
assistanceRequestSchema.index({ scheduledTime: 1 });

// Virtual for request age
assistanceRequestSchema.virtual('age').get(function() {
  return Date.now() - this.createdAt.getTime();
});

// Virtual for estimated completion time
assistanceRequestSchema.virtual('estimatedCompletion').get(function() {
  if (this.assignedStaff.assignedAt && this.estimatedDuration) {
    return new Date(this.assignedStaff.assignedAt.getTime() + (this.estimatedDuration * 60 * 1000));
  }
  return null;
});

// Method to assign staff
assistanceRequestSchema.methods.assignStaff = function(staffInfo) {
  this.assignedStaff = {
    ...staffInfo,
    assignedAt: new Date()
  };
  this.status = 'assigned';
  return this.save();
};

// Method to add note
assistanceRequestSchema.methods.addNote = function(message, addedBy, isInternal = false) {
  this.notes.push({
    message,
    addedBy,
    isInternal,
    timestamp: new Date()
  });
  return this.save();
};

// Method to update status
assistanceRequestSchema.methods.updateStatus = function(newStatus, note = null) {
  this.status = newStatus;
  
  if (newStatus === 'completed') {
    this.completedAt = new Date();
  } else if (newStatus === 'cancelled') {
    this.cancelledAt = new Date();
  }
  
  if (note) {
    this.notes.push({
      message: note,
      addedBy: 'system',
      timestamp: new Date()
    });
  }
  
  return this.save();
};

// Method to submit feedback
assistanceRequestSchema.methods.submitFeedback = function(rating, comment = '') {
  this.feedback = {
    rating,
    comment,
    submittedAt: new Date()
  };
  return this.save();
};

// Static method to get pending requests
assistanceRequestSchema.statics.getPendingRequests = function() {
  return this.find({ 
    status: { $in: ['pending', 'assigned', 'in_progress'] }
  })
  .populate('user', 'name email phone')
  .sort({ priority: -1, createdAt: 1 });
};

// Static method to get requests by type
assistanceRequestSchema.statics.getRequestsByType = function(type) {
  return this.find({ type })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
};

// Static method to get user's request history
assistanceRequestSchema.statics.getUserHistory = function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Pre-save middleware to set priority based on type
assistanceRequestSchema.pre('save', function(next) {
  if (this.isNew) {
    // Set priority based on assistance type
    switch (this.type) {
      case 'medical_emergency':
        this.priority = 'emergency';
        this.isUrgent = true;
        break;
      case 'wheelchair':
      case 'elderly_assistance':
        this.priority = 'high';
        break;
      case 'luggage_help':
      case 'navigation':
        this.priority = 'medium';
        break;
      default:
        this.priority = 'low';
    }
  }
  next();
});

module.exports = mongoose.model('AssistanceRequest', assistanceRequestSchema);
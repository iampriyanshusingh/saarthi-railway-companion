const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Facility name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Facility type is required'],
    enum: ['dining', 'restroom', 'shopping', 'medical', 'information', 'ticketing', 'banking', 'waiting', 'parking', 'other']
  },
  location: {
    x: {
      type: Number,
      required: [true, 'X coordinate is required']
    },
    y: {
      type: Number,
      required: [true, 'Y coordinate is required']
    },
    floor: {
      type: Number,
      default: 0
    }
  },
  description: {
    type: String,
    trim: true
  },
  isAccessible: {
    type: Boolean,
    default: true
  },
  operatingHours: {
    open: {
      type: String,
      default: '00:00'
    },
    close: {
      type: String,
      default: '23:59'
    },
    is24Hours: {
      type: Boolean,
      default: true
    }
  },
  amenities: [{
    type: String,
    enum: ['WiFi', 'AC', 'Wheelchair Access', 'Baby Changing', 'ATM', 'Charging Points']
  }],
  contact: {
    phone: String,
    email: String
  },
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const platformSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: [true, 'Platform number is required'],
    unique: true
  },
  name: {
    type: String,
    trim: true
  },
  location: {
    x: {
      type: Number,
      required: [true, 'X coordinate is required']
    },
    y: {
      type: Number,
      required: [true, 'Y coordinate is required']
    },
    floor: {
      type: Number,
      default: 0
    }
  },
  length: {
    type: Number,
    required: [true, 'Platform length is required'],
    min: 0
  },
  width: {
    type: Number,
    default: 10
  },
  isAccessible: {
    type: Boolean,
    default: true
  },
  amenities: [{
    type: String,
    enum: ['Shelter', 'Seating', 'Water Fountain', 'Announcement System', 'Digital Display', 'Lighting']
  }],
  capacity: {
    type: Number,
    default: 1000
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Station name is required'],
    trim: true
  },
  code: {
    type: String,
    required: [true, 'Station code is required'],
    unique: true,
    uppercase: true,
    trim: true,
    minlength: 2,
    maxlength: 5
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      min: -180,
      max: 180
    }
  },
  facilities: [facilitySchema],
  platforms: [platformSchema],
  layout: {
    width: {
      type: Number,
      default: 500
    },
    height: {
      type: Number,
      default: 300
    },
    floors: {
      type: Number,
      default: 1
    }
  },
  connectivity: {
    wifi: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      networkName: String,
      password: String
    },
    mobile: {
      coverage: {
        type: String,
        enum: ['Excellent', 'Good', 'Fair', 'Poor'],
        default: 'Good'
      }
    }
  },
  accessibility: {
    wheelchairAccess: {
      type: Boolean,
      default: true
    },
    elevators: {
      type: Number,
      default: 0
    },
    escalators: {
      type: Number,
      default: 0
    },
    ramps: {
      type: Number,
      default: 0
    },
    tactilePaving: {
      type: Boolean,
      default: false
    },
    audioAnnouncements: {
      type: Boolean,
      default: true
    }
  },
  emergencyServices: {
    police: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      contact: String,
      location: {
        x: Number,
        y: Number
      }
    },
    medical: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      contact: String,
      location: {
        x: Number,
        y: Number
      }
    },
    fire: {
      isAvailable: {
        type: Boolean,
        default: true
      },
      contact: String
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
stationSchema.index({ code: 1 });
stationSchema.index({ name: 1 });
stationSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });

// Method to find facility by type
stationSchema.methods.getFacilitiesByType = function(type) {
  return this.facilities.filter(facility => 
    facility.type === type && facility.isActive
  );
};

// Method to find nearest facility
stationSchema.methods.findNearestFacility = function(x, y, type = null) {
  let facilities = this.facilities.filter(facility => facility.isActive);
  
  if (type) {
    facilities = facilities.filter(facility => facility.type === type);
  }
  
  if (facilities.length === 0) return null;
  
  return facilities.reduce((nearest, facility) => {
    const distance = Math.sqrt(
      Math.pow(facility.location.x - x, 2) + 
      Math.pow(facility.location.y - y, 2)
    );
    
    const nearestDistance = Math.sqrt(
      Math.pow(nearest.location.x - x, 2) + 
      Math.pow(nearest.location.y - y, 2)
    );
    
    return distance < nearestDistance ? facility : nearest;
  });
};

// Method to get platform by number
stationSchema.methods.getPlatform = function(number) {
  return this.platforms.find(platform => 
    platform.number === number && platform.isActive
  );
};

// Static method to find station by code
stationSchema.statics.findByCode = function(code) {
  return this.findOne({ 
    code: code.toUpperCase(),
    isActive: true 
  });
};

module.exports = mongoose.model('Station', stationSchema);
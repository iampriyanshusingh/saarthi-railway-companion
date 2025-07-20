const Train = require('../models/Train');
const AssistanceRequest = require('../models/AssistanceRequest');

const socketHandlers = (socket, io) => {
  console.log(`👤 User connected: ${socket.id}`);

  // Join user to their personal room for targeted notifications
  socket.on('join_user_room', (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`👤 User ${userId} joined personal room`);
    }
  });

  // Join admin room for admin-specific notifications
  socket.on('join_admin_room', (userRole) => {
    if (userRole === 'admin') {
      socket.join('admin_room');
      console.log(`👑 Admin joined admin room`);
    }
  });

  // Handle train status updates (admin only)
  socket.on('update_train_status', async (data) => {
    try {
      const { trainNumber, status, delay, platform, announcement } = data;
      
      const train = await Train.findOne({ trainNumber: trainNumber.toUpperCase() });
      
      if (train) {
        // Update train status
        if (status) train.status = status;
        if (delay !== undefined) train.delay = delay;
        if (platform) train.platform = platform;
        
        // Add announcement if provided
        if (announcement) {
          train.addAnnouncement(announcement, 'platform_change');
        }
        
        await train.save();
        
        // Broadcast update to all connected clients
        io.emit('train_status_updated', {
          trainNumber: train.trainNumber,
          trainName: train.trainName,
          status: train.status,
          delay: train.delay,
          platform: train.platform,
          announcement: announcement || null,
          timestamp: new Date().toISOString()
        });
        
        console.log(`🚂 Train ${trainNumber} status updated: ${status}`);
      }
    } catch (error) {
      console.error('Error updating train status:', error);
      socket.emit('error', { message: 'Failed to update train status' });
    }
  });

  // Handle platform announcements (admin only)
  socket.on('send_announcement', async (data) => {
    try {
      const { message, type = 'general', trainNumber, platform } = data;
      
      // If it's for a specific train, update the train's announcements
      if (trainNumber) {
        const train = await Train.findOne({ trainNumber: trainNumber.toUpperCase() });
        if (train) {
          await train.addAnnouncement(message, type);
        }
      }
      
      // Broadcast announcement to all connected clients
      io.emit('station_announcement', {
        message,
        type,
        trainNumber: trainNumber || null,
        platform: platform || null,
        timestamp: new Date().toISOString()
      });
      
      console.log(`📢 Announcement sent: ${message}`);
    } catch (error) {
      console.error('Error sending announcement:', error);
      socket.emit('error', { message: 'Failed to send announcement' });
    }
  });

  // Handle assistance request updates
  socket.on('update_assistance_request', async (data) => {
    try {
      const { requestId, status, assignedStaff, note } = data;
      
      const request = await AssistanceRequest.findById(requestId)
        .populate('user', 'name email');
      
      if (request) {
        if (status) {
          await request.updateStatus(status, note);
        }
        
        if (assignedStaff) {
          await request.assignStaff(assignedStaff);
        }
        
        // Notify the user who made the request
        io.to(`user_${request.user._id}`).emit('assistance_request_updated', {
          request,
          message: `Your ${request.type} assistance request has been ${status || 'updated'}`
        });
        
        // Notify all admins
        io.to('admin_room').emit('assistance_request_updated', {
          request,
          message: `Assistance request ${status || 'updated'}`
        });
        
        console.log(`🆘 Assistance request ${requestId} updated: ${status}`);
      }
    } catch (error) {
      console.error('Error updating assistance request:', error);
      socket.emit('error', { message: 'Failed to update assistance request' });
    }
  });

  // Handle real-time location updates for navigation
  socket.on('update_location', (data) => {
    const { userId, location } = data;
    
    // Broadcast location update to relevant parties (e.g., assigned staff)
    socket.to(`user_${userId}`).emit('location_updated', {
      userId,
      location,
      timestamp: new Date().toISOString()
    });
  });

  // Handle emergency alerts
  socket.on('emergency_alert', (data) => {
    const { message, location, severity = 'high' } = data;
    
    // Broadcast emergency alert to all connected clients
    io.emit('emergency_alert', {
      message,
      location,
      severity,
      timestamp: new Date().toISOString()
    });
    
    // Also notify admin room specifically
    io.to('admin_room').emit('emergency_notification', {
      message: `Emergency Alert: ${message}`,
      location,
      severity,
      timestamp: new Date().toISOString()
    });
    
    console.log(`🚨 Emergency alert: ${message}`);
  });

  // Handle chat room functionality
  socket.on('join_chat_room', (roomId) => {
    socket.join(roomId);
    console.log(`💬 User joined chat room: ${roomId}`);
  });

  socket.on('leave_chat_room', (roomId) => {
    socket.leave(roomId);
    console.log(`💬 User left chat room: ${roomId}`);
  });

  socket.on('send_chat_message', (data) => {
    const { roomId, message, userId, userName } = data;
    
    // Broadcast message to all users in the room
    io.to(roomId).emit('chat_message_received', {
      message,
      userId,
      userName,
      timestamp: new Date().toISOString()
    });
  });

  // Handle typing indicators
  socket.on('typing_start', (data) => {
    const { roomId, userId, userName } = data;
    socket.to(roomId).emit('user_typing', { userId, userName });
  });

  socket.on('typing_stop', (data) => {
    const { roomId, userId } = data;
    socket.to(roomId).emit('user_stopped_typing', { userId });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`👤 User disconnected: ${socket.id}`);
  });

  // Handle connection errors
  socket.on('error', (error) => {
    console.error(`Socket error for ${socket.id}:`, error);
  });

  // Send welcome message
  socket.emit('connected', {
    message: 'Connected to Saarthi Railway Assistant',
    socketId: socket.id,
    timestamp: new Date().toISOString()
  });
};

module.exports = socketHandlers;
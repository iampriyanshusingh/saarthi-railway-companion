import React, { useState } from 'react';
import { Train, Users, MessageSquare, Settings, Plus, Edit, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSocket } from '../contexts/SocketContext.jsx';

const AdminDashboard = () => {
  const { socket } = useSocket();
  const [activeTab, setActiveTab] = useState('trains');
  const [newTrain, setNewTrain] = useState({
    name: '',
    number: '',
    platform: '',
    time: '',
    status: 'On Time'
  });

  const [trains, setTrains] = useState([
    { id: 1, name: 'Mumbai Express', number: '12345', platform: '1', time: '10:30 AM', status: 'On Time' },
    { id: 2, name: 'Delhi Rajdhani', number: '12306', platform: '2', time: '11:15 AM', status: 'Delayed' },
    { id: 3, name: 'Chennai Mail', number: '12678', platform: '3', time: '12:00 PM', status: 'On Time' }
  ]);

  const sendTrainUpdate = (message) => {
    if (socket) {
      socket.emit('sendTrainUpdate', {
        message,
        timestamp: new Date(),
        type: 'train'
      });
    }
  };

  const sendPlatformUpdate = (message) => {
    if (socket) {
      socket.emit('sendPlatformUpdate', {
        message,
        timestamp: new Date(),
        type: 'platform'
      });
    }
  };

  const handleAddTrain = (e) => {
    e.preventDefault();
    const train = {
      id: trains.length + 1,
      ...newTrain
    };
    setTrains([...trains, train]);
    sendTrainUpdate(`New train added: ${train.name} (${train.number}) at Platform ${train.platform}`);
    setNewTrain({ name: '', number: '', platform: '', time: '', status: 'On Time' });
  };

  const handleDeleteTrain = (id) => {
    const train = trains.find(t => t.id === id);
    if (train) {
      setTrains(trains.filter(t => t.id !== id));
      sendTrainUpdate(`Train ${train.name} (${train.number}) has been cancelled`);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updatedTrains = trains.map(train => {
      if (train.id === id) {
        const updatedTrain = { ...train, status: newStatus };
        sendTrainUpdate(`${train.name} (${train.number}) status updated to: ${newStatus}`);
        return updatedTrain;
      }
      return train;
    });
    setTrains(updatedTrains);
  };

  const stats = [
    { label: 'Active Trains', value: trains.length, icon: Train, color: 'bg-blue-500' },
    { label: 'Online Users', value: '247', icon: Users, color: 'bg-green-500' },
    { label: 'Chat Messages', value: '1,234', icon: MessageSquare, color: 'bg-purple-500' },
    { label: 'System Status', value: 'Operational', icon: Settings, color: 'bg-orange-500' }
  ];

  const tabs = [
    { id: 'trains', label: 'Train Management', icon: Train },
    { id: 'announcements', label: 'Announcements', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage station operations and real-time updates</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <div key={stat.label} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'trains' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New Train */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Train
              </h2>
              <form onSubmit={handleAddTrain} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Train Name</label>
                  <input
                    type="text"
                    value={newTrain.name}
                    onChange={(e) => setNewTrain({ ...newTrain, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Train Number</label>
                  <input
                    type="text"
                    value={newTrain.number}
                    onChange={(e) => setNewTrain({ ...newTrain, number: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                    <input
                      type="text"
                      value={newTrain.platform}
                      onChange={(e) => setNewTrain({ ...newTrain, platform: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <input
                      type="text"
                      value={newTrain.time}
                      onChange={(e) => setNewTrain({ ...newTrain, time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 10:30 AM"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add Train
                </button>
              </form>
            </motion.div>

            {/* Train List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Trains</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {trains.map((train) => (
                  <div key={train.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{train.name}</h3>
                      <p className="text-sm text-gray-600">
                        {train.number} • Platform {train.platform} • {train.time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={train.status}
                        onChange={(e) => handleStatusChange(train.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="On Time">On Time</option>
                        <option value="Delayed">Delayed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => handleDeleteTrain(train.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {activeTab === 'announcements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Announcements</h2>
            <div className="space-y-4">
              <button
                onClick={() => sendTrainUpdate('Attention passengers: All trains are running on time today.')}
                className="w-full p-4 text-left bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <h3 className="font-medium text-blue-900">General Train Update</h3>
                <p className="text-sm text-blue-700">Send a general announcement about train operations</p>
              </button>
              <button
                onClick={() => sendPlatformUpdate('Platform 2 is temporarily closed for maintenance. Passengers are requested to use alternative platforms.')}
                className="w-full p-4 text-left bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <h3 className="font-medium text-orange-900">Platform Maintenance</h3>
                <p className="text-sm text-orange-700">Announce platform maintenance or closures</p>
              </button>
              <button
                onClick={() => sendTrainUpdate('Due to weather conditions, some trains may experience delays. Please check with station staff for updates.')}
                className="w-full p-4 text-left bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <h3 className="font-medium text-yellow-900">Weather Alert</h3>
                <p className="text-sm text-yellow-700">Send weather-related announcements</p>
              </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Daily Passengers</h3>
                <p className="text-2xl font-bold text-primary-600">15,420</p>
                <p className="text-sm text-green-600">+12% from yesterday</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Chatbot Interactions</h3>
                <p className="text-2xl font-bold text-primary-600">1,234</p>
                <p className="text-sm text-green-600">+8% from yesterday</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Assistance Requests</h3>
                <p className="text-2xl font-bold text-primary-600">47</p>
                <p className="text-sm text-red-600">-3% from yesterday</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Average Response Time</h3>
                <p className="text-2xl font-bold text-primary-600">2.3s</p>
                <p className="text-sm text-green-600">-0.5s from yesterday</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
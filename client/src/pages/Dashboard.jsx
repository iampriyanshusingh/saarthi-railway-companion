import React from "react";
import {
  Clock,
  Train,
  MapPin,
  Bell,
  Armchair as Wheelchair,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { useSocket } from "../contexts/SocketContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { trainUpdates, platformUpdates } = useSocket();
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: MapPin,
      label: "Navigate Station",
      action: "navigate",
      color: "bg-blue-500",
      path: "/map"
    },
    {
      icon: Wheelchair,
      label: "Request Assistance",
      action: "assistance",
      color: "bg-green-500",
      path: "/assistance"
    },
    {
      icon: Train,
      label: "Track My Train",
      action: "track",
      color: "bg-purple-500",
      path: "/schedule"
    },
    {
      icon: Calendar,
      label: "Book Services",
      action: "book",
      color: "bg-orange-500",
      path: "/booking"
    },
  ];

  const upcomingTrains = [
    {
      id: 1,
      name: "Mumbai Express",
      number: "12345",
      platform: "1",
      time: "10:30 AM",
      status: "On Time",
    },
    {
      id: 2,
      name: "Delhi Rajdhani",
      number: "12306",
      platform: "2",
      time: "11:15 AM",
      status: "Delayed by 15 min",
    },
    {
      id: 3,
      name: "Chennai Mail",
      number: "12678",
      platform: "3",
      time: "12:00 PM",
      status: "On Time",
    },
    {
      id: 4,
      name: "Howrah Superfast",
      number: "12839",
      platform: "4",
      time: "01:45 PM",
      status: "On Time",
    },
    {
      id: 5,
      name: "Bengaluru Duronto",
      number: "12245",
      platform: "1",
      time: "02:30 PM",
      status: "On Time",
    },
    {
      id: 6,
      name: "Secunderabad SF",
      number: "12723",
      platform: "3",
      time: "03:00 PM",
      status: "Delayed by 5 min",
    },
    {
      id: 7,
      name: "Ahmedabad Express",
      number: "19031",
      platform: "2",
      time: "04:10 PM",
      status: "On Time",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Here's what's happening at your station today.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.action}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex flex-col items-center p-4 rounded-xl hover:shadow-md transition-all duration-200 group"
                    onClick={() => navigate(action.path)}
                  >
                    <div
                      className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}
                    >
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                      {action.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Upcoming Trains */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Upcoming Trains
                </h2>
                <Clock className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
              <div className="space-y-3">
                {upcomingTrains.map((train) => (
                  <div
                    key={train.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Train className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-gray-100">
                          {train.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Train No: {train.number}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {train.time}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Platform {train.platform}
                      </p>
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${
                          train.status === "On Time"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {train.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Real-time Updates */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Live Updates
              </h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {[...trainUpdates, ...platformUpdates]
                  .slice(0, 8)
                  .map((update, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <Bell className="w-4 h-4 text-blue-500 mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {update.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">
                          {new Date(update.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                {trainUpdates.length === 0 && platformUpdates.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-300 text-center py-4">
                    No recent updates
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather Widget */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 rounded-2xl shadow-lg p-6 text-white"
            >
              <h3 className="text-lg font-semibold mb-2">Station Weather</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">24°C</p>
                  <p className="text-blue-100">Partly Cloudy</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-100">Humidity: 65%</p>
                  <p className="text-blue-100">Wind: 12 km/h</p>
                </div>
              </div>
            </motion.div>

            {/* Station Services */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Station Services
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Food Court
                  </span>
                  <span className="text-green-600 text-sm">Open</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Medical Store
                  </span>
                  <span className="text-green-600 text-sm">Open</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Waiting Room
                  </span>
                  <span className="text-green-600 text-sm">Available</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    Wheelchair Service
                  </span>
                  <span className="text-green-600 text-sm">Available</span>
                </div>
              </div>
            </motion.div>

            {/* Emergency Contacts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-4">
                Emergency Contacts
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-red-700 dark:text-red-400">
                    Station Master
                  </span>
                  <span className="text-red-800 font-medium dark:text-red-200">
                    1234
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700 dark:text-red-400">
                    Medical Emergency
                  </span>
                  <span className="text-red-800 font-medium dark:text-red-200">
                    102
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700 dark:text-red-400">
                    Security
                  </span>
                  <span className="text-red-800 font-medium dark:text-red-200">
                    1322
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

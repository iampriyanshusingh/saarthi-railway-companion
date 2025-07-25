import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Map,
  Clock,
  MessageCircle,
  Accessibility,
  Globe,
  Shield,
  ArrowRight,
  Train,
  Navigation,
  Users,
} from "lucide-react";
import { useSocket } from "../contexts/SocketContext";

const Homepage = () => {
  const { trains, announcements, isConnected } = useSocket();

  const features = [
    {
      icon: Map,
      title: "3D Station Maps",
      description:
        "Interactive visual layouts with clickable locations for easy navigation",
      color: "bg-blue-500",
    },
    {
      icon: Navigation,
      title: "Real-time Navigation",
      description:
        "Step-by-step directions from entry to platforms with live updates",
      color: "bg-green-500",
    },
    {
      icon: MessageCircle,
      title: "AI Assistant",
      description:
        "Smart chatbot powered by AI to answer all your railway queries",
      color: "bg-purple-500",
    },
    {
      icon: Accessibility,
      title: "Accessibility First",
      description:
        "Voice commands, bilingual support, and wheelchair assistance",
      color: "bg-orange-500",
    },
    {
      icon: Clock,
      title: "Live Updates",
      description:
        "Real-time train schedules, platform changes, and announcements",
      color: "bg-red-500",
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Safe authentication and consistent service availability",
      color: "bg-indigo-500",
    },
  ];

  const recentTrains = trains?.slice(0, 3);
  const recentAnnouncements = announcements?.slice(0, 2);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              Welcome to Saarthi
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Your intelligent railway station assistant that transforms travel
              with AI-powered navigation, real-time updates, and
              accessibility-first design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/map"
                className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Map className="h-5 w-5" />
                <span>Explore Station Map</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/schedule"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-900 transition-colors flex items-center justify-center space-x-2"
              >
                <Clock className="h-5 w-5" />
                <span>View Live Schedule</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Status Bar */}
      <section className="from-white via-white to-white shadow-lg dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm font-medium text-gray-700 dark:text-white">
                {isConnected ? "Live Updates Active" : "Connecting..."}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-white">
              {trains?.length} trains tracked • {announcements?.length} recent
              announcements
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 from-white via-white to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 dark:backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">
              Smart Features for Modern Travel
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-gray-500">
              Experience the future of railway station navigation with our
              comprehensive suite of intelligent features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition duration-200 border border-teal-300 focus:ring-2 focus:ring-teal-400 dark:bg-gray-900 dark:shadow-gray-800 "
                >
                  <div
                    className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-6 `}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-white">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Dashboard Preview */}
      <section className="py-20 from-white via-white to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 ">
            {/* Recent Trains */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 transition duration-200 border border-teal-300 focus:ring-2 focus:ring-teal-400 dark:bg-gray-900 dark:shadow-gray-800 "
            >
              <div className="flex items-center space-x-3 mb-6 ">
                <Train className="h-6 w-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Live Train Updates
                </h3>
              </div>

              <div className="space-y-4">
                {recentTrains?.map((train) => (
                  <div
                    key={train.id}
                    className="bg-white rounded-lg p-4 shadow-sm transition duration-200 border border-teal-300 focus:ring-2 focus:ring-teal-400  dark:bg-gray-900 dark:shadow-gray-800"
                  >
                    <div className="flex justify-between items-start mb-2 ">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {train.trainName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {train.source} → {train.destination}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          train.status === "On Time"
                            ? "bg-green-100 text-green-800"
                            : train.status === "Delayed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {train.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{train.platform}</span>
                      <span>{train.estimatedTime}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/schedule"
                className="mt-6 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <span>View full schedule</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Recent Announcements */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 transition duration-200 border border-teal-300 focus:ring-2 focus:ring-teal-400 dark:bg-gray-900 dark:shadow-gray-800"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Users className="h-6 w-6 text-orange-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Station Announcements
                </h3>
              </div>

              <div className="space-y-4">
                {recentAnnouncements?.length > 0 ? (
                  recentAnnouncements?.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="bg-white rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            announcement.type === "emergency"
                              ? "bg-red-500"
                              : announcement.type === "warning"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {announcement.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-2">
                            {announcement.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              announcement.timestamp
                            ).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                    <p className="text-gray-500">No recent announcements</p>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <span className="text-sm text-gray-600">
                  Live updates powered by Socket.io
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Railway Experience?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who rely on Saarthi for seamless station navigation and real-time updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-orange-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Get Started Today
              </Link>
              <Link
                to="/map"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors"
              >
                Try Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Station Experience?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who are already using Saarthi to
              navigate stations with confidence and ease.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center px-8 py-4 bg-accent-500 text-white rounded-lg font-semibold hover:bg-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;

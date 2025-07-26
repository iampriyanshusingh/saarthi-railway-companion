import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

const HeroSection = ({ setActiveSection }) => {
  return (
    <section className="text-center overflow-hidden py-16 md:py-24 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl border border-gray-700 mb-10 md:mb-20 px-4 md:px-12">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4 md:mb-6 drop-shadow-lg leading-tight"
      >
        Welcome to Saarthi: Your Ultimate Railway Companion!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-lg md:text-2xl text-gray-200 text-center max-w-4xl mx-auto leading-relaxed"
      >
        Experience railway travel like never before. Saarthi brings you
        cutting-edge features, from immersive 3D station maps to intelligent AI
        assistance, all designed for a seamless, stress-free journey.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-6 md:mt-8"
      >
        <button
          onClick={() => setActiveSection("booking")}
          className="bg-gradient-to-r from-green-500 to-teal-600 text-white font-bold py-2 px-6 md:py-3 md:px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base md:text-lg"
        >
          Book Your Journey Now!
        </button>
      </motion.div>
    </section>
  );
};

export default HeroSection;

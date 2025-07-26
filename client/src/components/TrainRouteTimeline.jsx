import { motion, useAnimation, AnimatePresence } from "framer-motion";
import LucidIcon from "../components/LucidIcon";

const TrainRouteTimeline = ({ route, onClose, currentTrainLocation }) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-900 p-6 md:p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto relative"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 md:top-4 md:right-4 p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors duration-200"
        >
          <LucidIcon name="X" className="w-5 h-5 md:w-6 md:h-6" />
        </button>
        <h4 className="text-2xl md:text-3xl font-bold text-blue-400 mb-4 md:mb-6 text-center">
          Journey Route
        </h4>
        <div className="relative pl-4">
          <div className="absolute left-5 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600"></div>
          {route.map((stop, index) => (
            <div key={index} className="mb-4 md:mb-6 relative pl-8">
              <div
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-gray-800 z-10
                  ${
                    stop.station.toLowerCase() ===
                    currentTrainLocation.toLowerCase()
                      ? "bg-green-500 animate-pulse"
                      : "bg-blue-500"
                  }`}
              ></div>
              <p className="text-gray-100 font-semibold text-base md:text-lg">
                {stop.station}
              </p>
              <p className="text-gray-400 text-xs md:text-sm">
                {stop.arrivalTime !== "End" ? `Arr: ${stop.arrivalTime}` : ""}
                {stop.departureTime !== "End"
                  ? ` Dep: ${stop.departureTime}`
                  : ""}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TrainRouteTimeline;

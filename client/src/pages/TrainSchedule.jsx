import React, { useState, useEffect, useRef } from "react";
import TrainCard from "../Components/TrainCard";
import TrainRouteTimeline from "../Components/TrainRouteTImeline";
import LucidIcon from "../components/LucidIcon";
import trainsdata from "../utils/Data/trainsdata";
import { motion, useAnimation, AnimatePresence } from "framer-motion";

const TrainSchedule = () => {
  const [startStation, setStartStation] = useState("");
  const [endStation, setEndStation] = useState("");
  const [searchResults, setSearchResults] = useState(null); // null means no search performed yet
  const [activeFilter, setActiveFilter] = useState("All"); // 'All', 'Fast', 'Slow', 'AC'
  const [selectedTrain, setSelectedTrain] = useState(null); // State to hold the train for popup

  const handleTrainCardClick = (train) => {
    setSelectedTrain(train);
  };

  const handleClosePopup = () => {
    setSelectedTrain(null);
  };

  const handleSearch = () => {
    const lowerStartStation = startStation.toLowerCase().trim();
    const lowerEndStation = endStation.toLowerCase().trim();

    if (!lowerStartStation || !lowerEndStation) {
      setSearchResults([]);
      setActiveFilter("All");
      return;
    }

    const foundTrains = trainsdata.filter((train) => {
      const routeStations = train.route.map((stop) =>
        stop.station.toLowerCase().trim()
      );
      const startIndex = routeStations.indexOf(lowerStartStation);
      const endIndex = routeStations.indexOf(lowerEndStation);
      return startIndex !== -1 && endIndex !== -1;
    });

    setSearchResults(foundTrains);
    setActiveFilter("All");
  };

  const getFilteredSearchResults = () => {
    if (!searchResults) return [];

    if (activeFilter === "All") {
      return searchResults;
    }
    return searchResults.filter((train) => train.trainType === activeFilter);
  };

  return (
    <div className="p-4 md:p-8 animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-6 md:mb-10 text-center">
        Train Schedule
      </h2>

      {/* Search Feature */}
      <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-700 p-6 md:p-8 mb-8 md:mb-12 max-w-3xl mx-auto">
        <h3 className="text-2xl md:text-3xl font-bold text-blue-300 mb-4 md:mb-6 text-center flex items-center justify-center">
          <LucidIcon
            name="Search"
            className="w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3"
          />{" "}
          Find Your Train
        </h3>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Start Station"
            className="flex-1 p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={startStation}
            onChange={(e) => setStartStation(e.target.value)}
          />
          <input
            type="text"
            placeholder="End Station"
            className="flex-1 p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={endStation}
            onChange={(e) => setEndStation(e.target.value)}
          />
        </div>
        <button
          onClick={handleSearch}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-lg"
        >
          <LucidIcon name="Search" className="w-5 h-5 md:w-6 md:h-6 mr-2" />{" "}
          Search Trains
        </button>
      </div>

      {searchResults !== null ? (
        <div className="mt-8">
          <h3 className="text-2xl md:text-3xl font-bold text-blue-400 mb-4 md:mb-6 text-center">
            Search Results
          </h3>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 md:space-x-4 mb-8">
            {["All", "Fast", "Slow", "AC", "Intercity"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 md:px-6 md:py-2 rounded-full font-semibold text-sm md:text-base transition-all duration-200
                  ${
                    activeFilter === filter
                      ? "bg-gradient-to-r from-teal-500 to-green-600 text-white shadow-md"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {getFilteredSearchResults().length > 0 ? (
            <div className="space-y-4 md:space-y-6">
              {getFilteredSearchResults().map((train) => (
                <TrainCard
                  key={train.id}
                  train={train}
                  onClick={handleTrainCardClick}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center text-base md:text-xl">
              No trains found for this route with the selected filter.
            </p>
          )}
        </div>
      ) : (
        <div className="text-center p-6 md:p-10 bg-gray-900 rounded-xl shadow-lg border border-gray-700 max-w-xl mx-auto">
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Enter your start and end stations above to find trains!
          </p>
          <p className="text-base md:text-lg text-gray-500">
            For example: "Dadar" to "Thane" or "Churchgate" to "Virar".
          </p>
        </div>
      )}

      <AnimatePresence>
        {selectedTrain && (
          <TrainRouteTimeline
            route={selectedTrain.route}
            onClose={handleClosePopup}
            currentTrainLocation={selectedTrain.currentLocation}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrainSchedule;

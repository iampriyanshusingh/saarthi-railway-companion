import React, { useState, useEffect, useRef } from "react";
import LucidIcon from "./LucidIcon";
import react from "react";

const StationNavigator = () => {
  // Navigation state
  const [currentView, setCurrentView] = useState("map");
  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");
  const [routeSteps, setRouteSteps] = useState([]);
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [activeRoute, setActiveRoute] = useState(null);

  // Navigation simulation state
  const [currentStep, setCurrentStep] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [remainingDistance, setRemainingDistance] = useState(0);
  const [navigationProgress, setNavigationProgress] = useState(0);
  const navigationInterval = useRef(null);

  // Station layout data
  const stationBounds = [
    [51.504, -0.095], // Southwest corner
    [51.506, -0.075], // Northeast corner
  ];

  const userPosition = [51.505, -0.091];

  // Detailed station features
  const stationFeatures = [
    {
      id: "main_entrance",
      name: "Main Entrance",
      position: [51.5052, -0.091],
      type: "entrance",
    },
    {
      id: "north_entrance",
      name: "North Entrance",
      position: [51.506, -0.085],
      type: "entrance",
    },
    {
      id: "platform_1",
      name: "Platform 1",
      position: [51.5048, -0.088],
      type: "platform",
    },
    {
      id: "platform_2",
      name: "Platform 2",
      position: [51.5045, -0.087],
      type: "platform",
    },
    {
      id: "platform_3",
      name: "Platform 3",
      position: [51.5043, -0.086],
      type: "platform",
    },
    {
      id: "ticket_office",
      name: "Ticket Office",
      position: [51.505, -0.089],
      type: "service",
    },
    {
      id: "information",
      name: "Information Desk",
      position: [51.5051, -0.09],
      type: "service",
    },
    {
      id: "restroom",
      name: "Restrooms",
      position: [51.5049, -0.0895],
      type: "amenity",
    },
    {
      id: "cafe",
      name: "Station Cafe",
      position: [51.505, -0.088],
      type: "food",
    },
    {
      id: "shop",
      name: "Convenience Store",
      position: [51.5052, -0.0885],
      type: "shopping",
    },
    {
      id: "elevator_1",
      name: "Elevator (Main)",
      position: [51.505, -0.0895],
      type: "accessibility",
    },
    {
      id: "escalator_1",
      name: "Escalator (North)",
      position: [51.5055, -0.087],
      type: "accessibility",
    },
  ];

  const locations = [
    { id: "main_entrance", name: "Main Entrance" },
    { id: "north_entrance", name: "North Entrance" },
    { id: "platform_1", name: "Platform 1" },
    { id: "platform_2", name: "Platform 2" },
    { id: "platform_3", name: "Platform 3" },
    { id: "restroom", name: "Restrooms" },
    { id: "ticket_office", name: "Ticket Office" },
    { id: "information", name: "Information Desk" },
  ];

  // Train schedule data
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock train data
    const mockTrains = [
      {
        id: 1,
        number: "EC123",
        destination: "London",
        departure: "10:15",
        platform: "1",
        status: "On Time",
      },
      {
        id: 2,
        number: "IC456",
        destination: "Manchester",
        departure: "10:30",
        platform: "2",
        status: "Delayed 5 min",
      },
      {
        id: 3,
        number: "XC789",
        destination: "Birmingham",
        departure: "10:45",
        platform: "3",
        status: "On Time",
      },
    ];

    setTimeout(() => {
      setTrains(mockTrains);
      setLoading(false);
    }, 1000);

    // Initialize Leaflet default icons after Leaflet is loaded
    if (window.L) {
      delete window.L.Icon.Default.prototype._getIconUrl;
      window.L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
      });
    }

    return () => {
      if (navigationInterval.current) {
        clearInterval(navigationInterval.current);
      }
    };
  }, []);

  // Generate points between start and end for smooth movement
  const generateIntermediatePoints = (start, end, count = 10) => {
    const points = [];
    for (let i = 1; i <= count; i++) {
      const ratio = i / (count + 1);
      points.push([
        start[0] + (end[0] - start[0]) * ratio,
        start[1] + (end[1] - start[1]) * ratio,
      ]);
    }
    return points;
  };

  // Calculate distance between two points (simplified)
  const calculateDistance = (point1, point2) => {
    return (
      Math.sqrt(
        Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2)
      ) * 111320
    ); // Convert to meters (approximate)
  };

  // Calculate total route distance
  const calculateTotalDistance = (route) => {
    let distance = 0;
    for (let i = 1; i < route.length; i++) {
      distance += calculateDistance(route[i - 1], route[i]);
    }
    return distance;
  };

  // Voice announcement
  const announceInstruction = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Calculate route with intermediate points
  const calculateRoute = () => {
    if (!startPoint || !endPoint) return;

    const startFeature = stationFeatures.find((f) => f.id === startPoint);
    const endFeature = stationFeatures.find((f) => f.id === endPoint);

    if (!startFeature || !endFeature) return;

    // Generate route with intermediate points
    const intermediatePoints = generateIntermediatePoints(
      startFeature.position,
      endFeature.position
    );

    const steps = [
      `Start at ${startFeature.name}`,
      accessibilityMode
        ? "Take the accessible route via elevators"
        : "Take the direct route via stairs/escalators",
      `Follow signs to ${endFeature.name}`,
      `You have arrived at ${endFeature.name}`,
    ];

    const totalDistance = calculateTotalDistance([
      startFeature.position,
      ...intermediatePoints,
      endFeature.position,
    ]);
    const walkingSpeed = accessibilityMode ? 0.8 : 1.4; // m/s
    setEstimatedTime(Math.round(totalDistance / (walkingSpeed * 60)));

    setRouteSteps(steps);
    setActiveRoute([
      startFeature.position,
      ...intermediatePoints,
      endFeature.position,
    ]);
    setCurrentPosition(startFeature.position);
    setCurrentStep(0);
    setNavigationProgress(0);
    setCurrentView("map");
  };

  // Start navigation simulation
  const startNavigation = () => {
    if (!activeRoute || activeRoute.length < 2) return;

    setIsNavigating(true);
    setCurrentStep(0);
    setCurrentPosition(activeRoute[0]);
    setRemainingDistance(calculateTotalDistance(activeRoute));

    let step = 0;
    const totalSteps = activeRoute.length - 1;
    const stepDuration = (estimatedTime * 60 * 1000) / totalSteps; // ms per step

    navigationInterval.current = setInterval(() => {
      step++;
      if (step >= totalSteps) {
        completeNavigation();
        return;
      }

      setCurrentStep(step);
      setCurrentPosition(activeRoute[step]);
      setRemainingDistance(calculateTotalDistance(activeRoute.slice(step)));
      setNavigationProgress((step / totalSteps) * 100);

      // Announce instructions at certain points
      if (step === 1) {
        announceInstruction(
          "Begin walking " +
            (accessibilityMode ? "toward the elevators" : "toward the stairs")
        );
      } else if (step === Math.floor(totalSteps * 0.5)) {
        announceInstruction(
          `Continue straight for about ${Math.round(
            remainingDistance / 2
          )} meters`
        );
      } else if (step === totalSteps - 3) {
        announceInstruction(`Your destination is just ahead`);
      }

      // Simulate vibration for important turns
      if (step === 3 && navigator.vibrate) {
        navigator.vibrate(200);
      }
    }, stepDuration);
  };

  // Stop navigation
  const stopNavigation = () => {
    clearInterval(navigationInterval.current);
    setIsNavigating(false);
    announceInstruction("Navigation stopped");
  };

  // Complete navigation
  const completeNavigation = () => {
    clearInterval(navigationInterval.current);
    setIsNavigating(false);
    setNavigationProgress(100);
    announceInstruction(routeSteps[routeSteps.length - 1]);
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  };

  // Get icon for station features
  const getIconForFeature = (feature) => {
    // Ensure L is available before using it
    if (!window.L) return null;
    const icons = {
      entrance: "🚪",
      platform: "🚉",
      service: "ℹ️",
      amenity: "🚻",
      food: "☕",
      shopping: "🛍️",
      accessibility: "♿",
    };
    return window.L.divIcon({
      html: `<div class="text-blue-400 text-3xl">${
        icons[feature.type] || "📍"
      }</div>`,
      className: "bg-transparent",
    });
  };

  const handleNavigateToPlatform = (platform) => {
    setStartPoint("main_entrance");
    setEndPoint(`platform_${platform}`);
    calculateRoute();
  };

  const MapView = () => {
    // Ensure Leaflet components are available before rendering
    if (!window.ReactLeaflet || !window.L) {
      return (
        <p className="text-gray-400 text-center text-lg">
          Loading map components...
        </p>
      );
    }
    const { MapContainer, TileLayer, Marker, Popup, Polyline } =
      window.ReactLeaflet;

    return (
      <div className="mb-5 relative">
        <MapContainer
          center={currentPosition || [51.505, -0.09]}
          zoom={19}
          minZoom={18}
          maxBounds={stationBounds}
          className="h-[60vh] w-full rounded-lg shadow-xl border border-gray-700"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          />

          {stationFeatures.map((feature) => (
            <Marker
              key={feature.id}
              position={feature.position}
              icon={getIconForFeature(feature)}
            >
              <Popup>
                <strong className="text-gray-900">{feature.name}</strong>
                <br />
                <small className="text-gray-700">{feature.type}</small>
              </Popup>
            </Marker>
          ))}

          {activeRoute && (
            <Polyline
              positions={activeRoute}
              color="#6366F1" // Tailwind blue-600
              weight={5}
              opacity={0.7}
              dashArray="10, 10"
            />
          )}

          {currentPosition && (
            <Marker
              position={currentPosition}
              icon={window.L.divIcon({
                html: '<div class="text-blue-400 text-3xl"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="Lucid Lucid-walk"><path d="M13 4h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2v7.5"/><path d="M10 6.5V18l-2-2"/><path d="M10 6.5L8 4"/><path d="M17 14.5L19 16"/><path d="M8 10h.01"/><path d="M16 16h.01"/></svg></div>',
                className: "bg-transparent",
              })}
            >
              <Popup>Your current position</Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Navigation controls */}
        <div className="absolute bottom-6 right-4 z-10 bg-gray-800 p-4 rounded-xl shadow-2xl w-full max-w-sm md:max-w-md">
          {isNavigating ? (
            <div>
              <h3 className="text-lg md:text-xl font-bold text-blue-300 mb-2">
                Navigating to: {locations.find((l) => l.id === endPoint)?.name}
              </h3>
              <p className="text-gray-200 text-sm md:text-base mb-1">
                <strong className="font-semibold">Next:</strong>{" "}
                {
                  routeSteps[
                    Math.min(
                      Math.floor(currentStep / 5) + 1,
                      routeSteps.length - 1
                    )
                  ]
                }
              </p>
              <p className="text-gray-300 text-xs md:text-sm mb-1">
                <strong className="font-semibold">Remaining:</strong> ~
                {Math.round(remainingDistance)} meters
              </p>
              <p className="text-gray-300 text-xs md:text-sm mb-3">
                <strong className="font-semibold">Time:</strong> ~
                {Math.round(
                  remainingDistance / (accessibilityMode ? 0.8 : 1.4) / 60
                )}{" "}
                minutes
              </p>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${navigationProgress}%` }}
                ></div>
              </div>
              <button
                onClick={stopNavigation}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-base"
              >
                <LucidIcon name="StopCircle" className="w-5 h-5 mr-2" /> Stop
                Navigation
              </button>
            </div>
          ) : activeRoute ? (
            <div>
              <h3 className="text-lg md:text-xl font-bold text-blue-300 mb-2">
                Ready to Navigate
              </h3>
              <p className="text-gray-200 text-sm md:text-base mb-1">
                Route to: {locations.find((l) => l.id === endPoint)?.name}
              </p>
              <p className="text-gray-300 text-xs md:text-sm mb-1">
                <strong className="font-semibold">Distance:</strong> ~
                {Math.round(calculateTotalDistance(activeRoute))} meters
              </p>
              <p className="text-gray-300 text-xs md:text-sm mb-3">
                <strong className="font-semibold">Est. Time:</strong> ~
                {estimatedTime} minutes
              </p>
              <button
                onClick={startNavigation}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-base"
              >
                <LucidIcon name="Play" className="w-5 h-5 mr-2" /> Start
                Navigation
              </button>
            </div>
          ) : (
            <p className="text-gray-400 text-center text-sm">
              Select a route to begin navigation
            </p>
          )}
        </div>

        {routeSteps.length > 0 && (
          <div className="bg-gray-800 p-4 rounded-xl shadow-lg mt-4">
            <h3 className="text-xl md:text-2xl font-bold text-blue-300 mb-3">
              Route Instructions
            </h3>
            <ol className="pl-5 list-decimal list-inside text-gray-200">
              {routeSteps.map((step, index) => (
                <li key={index} className="my-2 text-base">
                  {step}
                </li>
              ))}
            </ol>
            <button
              onClick={() => {
                const utterance = new SpeechSynthesisUtterance(
                  routeSteps.join(". Next, ")
                );
                window.speechSynthesis.speak(utterance);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center text-base mt-4"
            >
              <LucidIcon name="Volume2" className="w-5 h-5 mr-2" /> Read All
              Instructions Aloud
            </button>
          </div>
        )}
      </div>
    );
  };

  const TrainScheduleView = () => (
    <div className="p-4 md:p-8 animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-bold text-blue-400 mb-6 text-center">
        <LucidIcon name="Train" className="inline-block w-8 h-8 mr-2" />{" "}
        Departures
      </h2>
      {loading ? (
        <p className="text-gray-400 text-center text-lg">
          Loading train data...
        </p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-700">
          <table className="min-w-full bg-gray-800 text-gray-100">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="p-3 text-left">Time</th>
                <th className="p-3 text-left">Train</th>
                <th className="p-3 text-left">Destination</th>
                <th className="p-3 text-left">Platform</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {trains.map((train) => (
                <tr
                  key={train.id}
                  className="border-b border-gray-700 last:border-b-0 hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="p-3">{train.departure}</td>
                  <td className="p-3">{train.number}</td>
                  <td className="p-3">{train.destination}</td>
                  <td className="p-3">{train.platform}</td>
                  <td
                    className={`p-3 ${
                      train.status.includes("Delayed")
                        ? "text-red-400"
                        : "text-green-400"
                    }`}
                  >
                    {train.status}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => handleNavigateToPlatform(train.platform)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-md shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center text-sm"
                    >
                      <LucidIcon name="Navigation" className="w-4 h-4 mr-1" />{" "}
                      Guide Me
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const NavigationPanelView = () => (
    <div className="p-6 bg-gray-900 rounded-xl shadow-2xl border border-gray-700 animate-fade-in">
      <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-6 text-center">
        <LucidIcon name="Route" className="inline-block w-7 h-7 mr-2" /> Station
        Navigation
      </h2>

      <div className="mb-5">
        <label
          htmlFor="start-point"
          className="block mb-2 font-semibold text-gray-300"
        >
          From:
        </label>
        <select
          id="start-point"
          value={startPoint}
          onChange={(e) => setStartPoint(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select starting point</option>
          {locations.map((loc) => (
            <option key={`start-${loc.id}`} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label
          htmlFor="end-point"
          className="block mb-2 font-semibold text-gray-300"
        >
          To:
        </label>
        <select
          id="end-point"
          value={endPoint}
          onChange={(e) => setEndPoint(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select destination</option>
          {locations.map((loc) => (
            <option key={`end-${loc.id}`} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label className="flex items-center cursor-pointer text-gray-300">
          <input
            type="checkbox"
            checked={accessibilityMode}
            onChange={() => setAccessibilityMode(!accessibilityMode)}
            className="mr-2 w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700"
          />
          <span className="text-base">
            Accessibility Mode (Elevators/Ramps)
          </span>
        </label>
      </div>

      <button
        onClick={calculateRoute}
        disabled={!startPoint || !endPoint}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-lg disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        <LucidIcon name="CircleDotDashed" className="w-5 h-5 mr-2" />
        {!startPoint || !endPoint
          ? "Select Locations First"
          : "Calculate Route"}
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 relative z-0">
      <header className="bg-gradient-to-r from-blue-700 to-purple-800 text-white p-5 flex flex-col md:flex-row justify-between items-center mb-8 rounded-xl shadow-xl">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-4 md:mb-0">
          <LucidIcon name="Map" className="inline-block w-8 h-8 mr-2" /> Station
          Navigator
        </h1>
        <nav className="flex flex-wrap justify-center gap-3 md:space-x-3">
          <button
            onClick={() => setCurrentView("map")}
            className={`px-4 py-2 rounded-lg transition-colors duration-300 text-base font-medium flex items-center
              ${
                currentView === "map"
                  ? "bg-blue-800 shadow-md"
                  : "bg-transparent hover:bg-blue-800/20"
              }`}
          >
            <LucidIcon name="Map" className="w-5 h-5 mr-1" /> Map
          </button>
          <button
            onClick={() => setCurrentView("trains")}
            className={`px-4 py-2 rounded-lg transition-colors duration-300 text-base font-medium flex items-center
              ${
                currentView === "trains"
                  ? "bg-blue-800 shadow-md"
                  : "bg-transparent hover:bg-blue-800/20"
              }`}
          >
            <LucidIcon name="Train" className="w-5 h-5 mr-1" /> Trains
          </button>
          <button
            onClick={() => setCurrentView("navigate")}
            className={`px-4 py-2 rounded-lg transition-colors duration-300 text-base font-medium flex items-center
              ${
                currentView === "navigate"
                  ? "bg-blue-800 shadow-md"
                  : "bg-transparent hover:bg-blue-800/20"
              }`}
          >
            <LucidIcon name="Navigation" className="w-5 h-5 mr-1" /> Navigate
          </button>
        </nav>
      </header>

      <main className="px-0">
        {currentView === "map" && <MapView />}
        {currentView === "trains" && <TrainScheduleView />}
        {currentView === "navigate" && <NavigationPanelView />}
      </main>
    </div>
  );
};

export default StationNavigator;

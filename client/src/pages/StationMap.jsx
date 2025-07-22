import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

const StationNavigator = () => {
  // Navigation state
  const [currentView, setCurrentView] = useState('map');
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
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
    [51.506, -0.075]  // Northeast corner
  ];

  const userPosition = [51.505, -0.091];
  
  // Detailed station features
  const stationFeatures = [
    { id: 'main_entrance', name: "Main Entrance", position: [51.5052, -0.091], type: "entrance" },
    { id: 'north_entrance', name: "North Entrance", position: [51.506, -0.085], type: "entrance" },
    { id: 'platform_1', name: "Platform 1", position: [51.5048, -0.088], type: "platform" },
    { id: 'platform_2', name: "Platform 2", position: [51.5045, -0.087], type: "platform" },
    { id: 'platform_3', name: "Platform 3", position: [51.5043, -0.086], type: "platform" },
    { id: 'ticket_office', name: "Ticket Office", position: [51.505, -0.089], type: "service" },
    { id: 'information', name: "Information Desk", position: [51.5051, -0.090], type: "service" },
    { id: 'restroom', name: "Restrooms", position: [51.5049, -0.0895], type: "amenity" },
    { id: 'cafe', name: "Station Cafe", position: [51.505, -0.088], type: "food" },
    { id: 'shop', name: "Convenience Store", position: [51.5052, -0.0885], type: "shopping" },
    { id: 'elevator_1', name: "Elevator (Main)", position: [51.505, -0.0895], type: "accessibility" },
    { id: 'escalator_1', name: "Escalator (North)", position: [51.5055, -0.087], type: "accessibility" }
  ];

  const locations = [
    { id: "main_entrance", name: "Main Entrance" },
    { id: "north_entrance", name: "North Entrance" },
    { id: "platform_1", name: "Platform 1" },
    { id: "platform_2", name: "Platform 2" },
    { id: "platform_3", name: "Platform 3" },
    { id: "restroom", name: "Restrooms" },
    { id: "ticket_office", name: "Ticket Office" },
    { id: "information", name: "Information Desk" }
  ];

  // Train schedule data
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock train data
    const mockTrains = [
      { id: 1, number: "EC123", destination: "London", departure: "10:15", platform: "1", status: "On Time" },
      { id: 2, number: "IC456", destination: "Manchester", departure: "10:30", platform: "2", status: "Delayed 5 min" },
      { id: 3, number: "XC789", destination: "Birmingham", departure: "10:45", platform: "3", status: "On Time" },
    ];
    
    setTimeout(() => {
      setTrains(mockTrains);
      setLoading(false);
    }, 1000);

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
        start[1] + (end[1] - start[1]) * ratio
      ]);
    }
    return points;
  };

  // Calculate distance between two points (simplified)
  const calculateDistance = (point1, point2) => {
    return Math.sqrt(
      Math.pow(point1[0] - point2[0], 2) + 
      Math.pow(point1[1] - point2[1], 2)
    ) * 111320; // Convert to meters (approximate)
  };

  // Calculate total route distance
  const calculateTotalDistance = (route) => {
    let distance = 0;
    for (let i = 1; i < route.length; i++) {
      distance += calculateDistance(route[i-1], route[i]);
    }
    return distance;
  };

  // Voice announcement
  const announceInstruction = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Calculate route with intermediate points
  const calculateRoute = () => {
    if (!startPoint || !endPoint) return;
    
    const startFeature = stationFeatures.find(f => f.id === startPoint);
    const endFeature = stationFeatures.find(f => f.id === endPoint);
    
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
      `You have arrived at ${endFeature.name}`
    ];
    
    const totalDistance = calculateTotalDistance([startFeature.position, ...intermediatePoints, endFeature.position]);
    const walkingSpeed = accessibilityMode ? 0.8 : 1.4; // m/s
    setEstimatedTime(Math.round(totalDistance / (walkingSpeed * 60)));
    
    setRouteSteps(steps);
    setActiveRoute([startFeature.position, ...intermediatePoints, endFeature.position]);
    setCurrentPosition(startFeature.position);
    setCurrentStep(0);
    setNavigationProgress(0);
    setCurrentView('map');
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
        announceInstruction("Begin walking " + (accessibilityMode ? "toward the elevators" : "toward the stairs"));
      } else if (step === Math.floor(totalSteps * 0.5)) {
        announceInstruction(`Continue straight for about ${Math.round(remainingDistance/2)} meters`);
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
    const icons = {
      entrance: "🚪",
      platform: "🚉",
      service: "ℹ️",
      amenity: "🚻",
      food: "☕",
      shopping: "🛍️",
      accessibility: "♿"
    };
    return L.divIcon({
      html: `<div style="font-size: 24px">${icons[feature.type] || "📍"}</div>`,
      className: 'custom-icon'
    });
  };

  const handleNavigateToPlatform = (platform) => {
    setStartPoint('main_entrance');
    setEndPoint(`platform_${platform}`);
    calculateRoute();
  };

  const MapView = () => (
    <div style={{ marginBottom: '20px', position: 'relative' }}>
      <MapContainer 
        center={currentPosition || [51.505, -0.09]} 
        zoom={19}
        minZoom={18}
        maxBounds={stationBounds}
        style={{ height: "60vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        />
        
        {stationFeatures.map(feature => (
          <Marker 
            key={feature.id} 
            position={feature.position}
            icon={getIconForFeature(feature)}
          >
            <Popup>
              <strong>{feature.name}</strong><br/>
              <small>{feature.type}</small>
            </Popup>
          </Marker>
        ))}
        
        {activeRoute && (
          <Polyline 
            positions={activeRoute} 
            color="blue" 
            weight={5} 
            opacity={0.7} 
            dashArray="10, 10"
          />
        )}
        
        {currentPosition && (
          <Marker 
            position={currentPosition}
            icon={L.divIcon({
              html: '<div style="font-size: 24px">🧍</div>',
              className: 'user-icon'
            })}
          >
            <Popup>Your current position</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Navigation controls */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        right: '10px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 0 15px rgba(0,0,0,0.2)',
        width: 'calc(100% - 40px)',
        maxWidth: '400px'
      }}>
        {isNavigating ? (
          <div>
            <h3 style={{ marginTop: 0 }}>
              Navigating to: {locations.find(l => l.id === endPoint)?.name}
            </h3>
            <p style={{ fontSize: '1.1em', margin: '10px 0' }}>
              <strong>Next:</strong> {routeSteps[Math.min(Math.floor(currentStep / 5) + 1, routeSteps.length - 1)]}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Remaining:</strong> ~{Math.round(remainingDistance)} meters
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Time:</strong> ~{Math.round((remainingDistance / (accessibilityMode ? 0.8 : 1.4) / 60))} minutes
            </p>
            <div style={{
              width: '100%',
              backgroundColor: '#eee',
              borderRadius: '5px',
              margin: '15px 0',
              height: '10px'
            }}>
              <div style={{
                width: `${navigationProgress}%`,
                height: '100%',
                backgroundColor: '#28a745',
                borderRadius: '5px',
                transition: 'width 1s linear'
              }}></div>
            </div>
            <button 
              onClick={stopNavigation}
              style={{
                padding: '8px 15px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '1em',
                width: '100%'
              }}
            >
              Stop Navigation
            </button>
          </div>
        ) : activeRoute ? (
          <div>
            <h3 style={{ marginTop: 0 }}>Ready to Navigate</h3>
            <p style={{ margin: '10px 0' }}>
              Route to: {locations.find(l => l.id === endPoint)?.name}
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Distance:</strong> ~{Math.round(calculateTotalDistance(activeRoute))} meters
            </p>
            <p style={{ margin: '5px 0' }}>
              <strong>Est. Time:</strong> ~{estimatedTime} minutes
            </p>
            <button 
              onClick={startNavigation}
              style={{
                padding: '8px 15px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '1em',
                width: '100%'
              }}
            >
              Start Navigation
            </button>
          </div>
        ) : (
          <p>Select a route to begin navigation</p>
        )}
      </div>

      {routeSteps.length > 0 && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '15px',
          borderRadius: '8px',
          marginTop: '15px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0 }}>Route Instructions</h3>
          <ol style={{ paddingLeft: '20px' }}>
            {routeSteps.map((step, index) => (
              <li key={index} style={{ margin: '10px 0', fontSize: '1.05em' }}>
                {step}
              </li>
            ))}
          </ol>
          <button 
            onClick={() => {
              const utterance = new SpeechSynthesisUtterance(routeSteps.join('. Next, '));
              window.speechSynthesis.speak(utterance);
            }}
            style={{ 
              padding: '8px 15px',
              backgroundColor: '#0056b3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1em',
              marginTop: '10px'
            }}
          >
            🔊 Read All Instructions Aloud
          </button>
        </div>
      )}
    </div>
  );

  const TrainScheduleView = () => (
    <div>
      <h2 style={{ color: '#333' }}>Departures</h2>
      {loading ? (
        <p>Loading train data...</p>
      ) : (
        <div style={{ overflowX: 'auto', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#0056b3', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Time</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Train</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Destination</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Platform</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {trains.map(train => (
                <tr key={train.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{train.departure}</td>
                  <td style={{ padding: '12px' }}>{train.number}</td>
                  <td style={{ padding: '12px' }}>{train.destination}</td>
                  <td style={{ padding: '12px' }}>{train.platform}</td>
                  <td style={{ padding: '12px', 
                    color: train.status.includes('Delayed') ? '#dc3545' : '#28a745'
                  }}>
                    {train.status}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button 
                      onClick={() => handleNavigateToPlatform(train.platform)}
                      style={{ 
                        padding: '6px 12px',
                        backgroundColor: '#0056b3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
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
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f8f9fa', 
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ color: '#333', marginTop: 0 }}>Station Navigation</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>From:</label>
        <select 
          value={startPoint} 
          onChange={(e) => setStartPoint(e.target.value)}
          style={{ 
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '1em'
          }}
        >
          <option value="">Select starting point</option>
          {locations.map(loc => (
            <option key={`start-${loc.id}`} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>To:</label>
        <select 
          value={endPoint} 
          onChange={(e) => setEndPoint(e.target.value)}
          style={{ 
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ddd',
            fontSize: '1em'
          }}
        >
          <option value="">Select destination</option>
          {locations.map(loc => (
            <option key={`end-${loc.id}`} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input 
            type="checkbox" 
            checked={accessibilityMode}
            onChange={() => setAccessibilityMode(!accessibilityMode)}
            style={{ 
              marginRight: '10px',
              width: '18px',
              height: '18px'
            }}
          />
          <span style={{ fontSize: '1em' }}>Accessibility Mode (Elevators/Ramps)</span>
        </label>
      </div>
      
      <button 
        onClick={calculateRoute}
        disabled={!startPoint || !endPoint}
        style={{ 
          padding: '12px',
          backgroundColor: !startPoint || !endPoint ? '#6c757d' : '#0056b3',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          width: '100%',
          fontSize: '1em',
          cursor: !startPoint || !endPoint ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s'
        }}
      >
        {!startPoint || !endPoint ? 'Select Locations First' : 'Calculate Route'}
      </button>
    </div>
  );

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '1000px', 
      margin: '0 auto',
      padding: '20px',
      position: 'relative',
      zIndex: 0,
    }}>
      <header style={{
        backgroundColor: '#0056b3',
        color: 'white',
        padding: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.8em' }}>
          <span role="img" aria-label="Train">🚉</span> Station Navigator
        </h1>
        <nav style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setCurrentView('map')}
            style={{ 
              padding: '8px 16px',
              backgroundColor: currentView === 'map' ? '#003d7a' : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em',
              transition: 'background-color 0.3s'
            }}
          >
            Map
          </button>
          <button 
            onClick={() => setCurrentView('trains')}
            style={{ 
              padding: '8px 16px',
              backgroundColor: currentView === 'trains' ? '#003d7a' : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em',
              transition: 'background-color 0.3s'
            }}
          >
            Trains
          </button>
          <button 
            onClick={() => setCurrentView('navigate')}
            style={{ 
              padding: '8px 16px',
              backgroundColor: currentView === 'navigate' ? '#003d7a' : 'transparent',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em',
              transition: 'background-color 0.3s'
            }}
          >
            Navigate
          </button>
        </nav>
      </header>

      <main style={{ padding: '0 10px' }}>
        {currentView === 'map' && <MapView />}
        {currentView === 'trains' && <TrainScheduleView />}
        {currentView === 'navigate' && <NavigationPanelView />}
      </main>

    </div>
  );
};

export default StationNavigator;
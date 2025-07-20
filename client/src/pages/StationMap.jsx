// import React, { useState, useRef, useEffect } from 'react';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, Text, Box, Plane } from '@react-three/drei';
// import { Navigation, MapPin, Route, Info, Accessibility } from 'lucide-react';
// import { motion, AnimatePresence } from 'framer-motion';

// const StationMap = () => {
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [navigationMode, setNavigationMode] = useState(false);
//   const [startPoint, setStartPoint] = useState(null);
//   const [endPoint, setEndPoint] = useState(null);
//   const [pathVisible, setPathVisible] = useState(false);

//   // Station locations with 3D coordinates
//   const locations = [
//     { id: 'platform1', name: 'Platform 1', position: [-8, 0, -2], type: 'platform', info: 'Trains to Mumbai, Delhi' },
//     { id: 'platform2', name: 'Platform 2', position: [-8, 0, 2], type: 'platform', info: 'Trains to Bangalore, Chennai' },
//     { id: 'platform3', name: 'Platform 3', position: [-8, 0, 6], type: 'platform', info: 'Trains to Kolkata, Hyderabad' },
//     { id: 'foodcourt', name: 'Food Court', position: [0, 0, -6], type: 'amenity', info: 'Restaurants, Cafes, Snacks' },
//     { id: 'restroom1', name: 'Restroom 1', position: [2, 0, -2], type: 'amenity', info: 'Men & Women facilities' },
//     { id: 'restroom2', name: 'Restroom 2', position: [2, 0, 6], type: 'amenity', info: 'Men & Women facilities' },
//     { id: 'ticket', name: 'Ticket Counter', position: [6, 0, 0], type: 'service', info: 'Booking, Reservations, Enquiry' },
//     { id: 'entrance', name: 'Main Entrance', position: [8, 0, 0], type: 'entrance', info: 'Station Entry/Exit point' },
//     { id: 'waiting', name: 'Waiting Room', position: [0, 0, 2], type: 'amenity', info: 'AC Waiting Room' },
//     { id: 'pharmacy', name: 'Medical Store', position: [4, 0, -4], type: 'service', info: 'Medicines, First Aid' }
//   ];

//   const getLocationColor = (type) => {
//     switch (type) {
//       case 'platform': return '#3b82f6';
//       case 'amenity': return '#10b981';
//       case 'service': return '#f59e0b';
//       case 'entrance': return '#ef4444';
//       default: return '#6b7280';
//     }
//   };

//   const LocationMarker = ({ location, onClick }) => {
//     const [hovered, setHovered] = useState(false);

//     return (
//       <group position={location.position}>
//         <Box
//           args={[1, 2, 1]}
//           onPointerOver={() => setHovered(true)}
//           onPointerOut={() => setHovered(false)}
//           onClick={() => onClick(location)}
//           scale={hovered ? 1.2 : 1}
//         >
//           <meshStandardMaterial color={getLocationColor(location.type)} transparent opacity={0.8} />
//         </Box>
//         <Text
//           position={[0, 2.5, 0]}
//           fontSize={0.5}
//           color="#1f2937"
//           anchorX="center"
//           anchorY="middle"
//           font="/fonts/inter-bold.woff"
//         >
//           {location.name}
//         </Text>
//       </group>
//     );
//   };

//   const PathLine = ({ start, end }) => {
//     const points = [
//       start.position[0], start.position[1] + 0.1, start.position[2],
//       end.position[0], end.position[1] + 0.1, end.position[2]
//     ];

//     return (
//       <line>
//         <bufferGeometry>
//           <bufferAttribute
//             attachObject={['attributes', 'position']}
//             array={new Float32Array(points)}
//             count={2}
//             itemSize={3}
//           />
//         </bufferGeometry>
//         <lineBasicMaterial color="#ef4444" linewidth={3} />
//       </line>
//     );
//   };

//   const handleLocationClick = (location) => {
//     setSelectedLocation(location);
    
//     if (navigationMode) {
//       if (!startPoint) {
//         setStartPoint(location);
//       } else if (!endPoint && location.id !== startPoint.id) {
//         setEndPoint(location);
//         setPathVisible(true);
//       } else {
//         // Reset navigation
//         setStartPoint(location);
//         setEndPoint(null);
//         setPathVisible(false);
//       }
//     }
//   };

//   const startNavigation = () => {
//     setNavigationMode(true);
//     setStartPoint(null);
//     setEndPoint(null);
//     setPathVisible(false);
//     setSelectedLocation(null);
//   };

//   const stopNavigation = () => {
//     setNavigationMode(false);
//     setStartPoint(null);
//     setEndPoint(null);
//     setPathVisible(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-8"
//         >
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">3D Station Map</h1>
//           <p className="text-gray-600">Navigate through the station with our interactive 3D map</p>
//         </motion.div>

//         {/* Controls */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-6 flex flex-wrap gap-4"
//         >
//           {!navigationMode ? (
//             <button
//               onClick={startNavigation}
//               className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
//             >
//               <Navigation className="w-4 h-4 mr-2" />
//               Start Navigation
//             </button>
//           ) : (
//             <div className="flex items-center gap-4">
//               <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
//                 {!startPoint ? 'Select starting point' : 
//                  !endPoint ? 'Select destination' : 
//                  'Route found!'}
//               </div>
//               <button
//                 onClick={stopNavigation}
//                 className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
//               >
//                 Stop Navigation
//               </button>
//             </div>
//           )}
          
//           <div className="flex items-center gap-2">
//             <div className="flex items-center gap-1">
//               <div className="w-3 h-3 bg-blue-500 rounded"></div>
//               <span className="text-sm text-gray-600">Platforms</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <div className="w-3 h-3 bg-green-500 rounded"></div>
//               <span className="text-sm text-gray-600">Amenities</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <div className="w-3 h-3 bg-amber-500 rounded"></div>
//               <span className="text-sm text-gray-600">Services</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <div className="w-3 h-3 bg-red-500 rounded"></div>
//               <span className="text-sm text-gray-600">Entrance</span>
//             </div>
//           </div>
//         </motion.div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* 3D Map */}
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="lg:col-span-2 h-96 lg:h-[600px] bg-white rounded-2xl shadow-lg overflow-hidden"
//           >
//             <Canvas camera={{ position: [15, 15, 15], fov: 60 }}>
//               <ambientLight intensity={0.6} />
//               <directionalLight position={[10, 10, 5]} intensity={1} />
              
//               {/* Station Floor */}
//               <Plane args={[20, 15]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
//                 <meshStandardMaterial color="#e5e7eb" />
//               </Plane>
              
//               {/* Location Markers */}
//               {locations.map((location) => (
//                 <LocationMarker
//                   key={location.id}
//                   location={location}
//                   onClick={handleLocationClick}
//                 />
//               ))}
              
//               {/* Navigation Path */}
//               {pathVisible && startPoint && endPoint && (
//                 <PathLine start={startPoint} end={endPoint} />
//               )}
              
//               <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
//             </Canvas>
//           </motion.div>

//           {/* Information Panel */}
//           <motion.div
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="space-y-6"
//           >
//             {/* Selected Location Info */}
//             <AnimatePresence>
//               {selectedLocation && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   className="bg-white p-6 rounded-2xl shadow-lg"
//                 >
//                   <div className="flex items-start gap-3 mb-4">
//                     <div 
//                       className="w-8 h-8 rounded-lg flex items-center justify-center"
//                       style={{ backgroundColor: getLocationColor(selectedLocation.type) + '20' }}
//                     >
//                       <MapPin 
//                         className="w-4 h-4" 
//                         style={{ color: getLocationColor(selectedLocation.type) }}
//                       />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{selectedLocation.name}</h3>
//                       <p className="text-sm text-gray-600 capitalize">{selectedLocation.type}</p>
//                     </div>
//                   </div>
//                   <p className="text-gray-700 mb-4">{selectedLocation.info}</p>
//                   <div className="flex gap-2">
//                     <button className="flex-1 px-3 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-100 transition-colors">
//                       Get Directions
//                     </button>
//                     <button className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
//                       <Info className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Navigation Status */}
//             {navigationMode && (
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="bg-blue-50 border border-blue-200 p-4 rounded-xl"
//               >
//                 <h3 className="font-semibold text-blue-900 mb-2">Navigation Mode</h3>
//                 {startPoint && (
//                   <div className="text-sm text-blue-700 mb-1">
//                     From: <span className="font-medium">{startPoint.name}</span>
//                   </div>
//                 )}
//                 {endPoint && (
//                   <div className="text-sm text-blue-700 mb-2">
//                     To: <span className="font-medium">{endPoint.name}</span>
//                   </div>
//                 )}
//                 {pathVisible && (
//                   <div className="text-sm text-green-700 font-medium">
//                     ✓ Route calculated successfully
//                   </div>
//                 )}
//               </motion.div>
//             )}

//             {/* Quick Actions */}
//             <div className="bg-white p-6 rounded-2xl shadow-lg">
//               <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
//               <div className="space-y-3">
//                 <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
//                   <Accessibility className="w-5 h-5 text-green-600" />
//                   <div>
//                     <div className="font-medium text-gray-900">Request Assistance</div>
//                     <div className="text-sm text-gray-600">Wheelchair, Porter service</div>
//                   </div>
//                 </button>
//                 <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors">
//                   <Route className="w-5 h-5 text-blue-600" />
//                   <div>
//                     <div className="font-medium text-gray-900">Find Shortest Path</div>
//                     <div className="text-sm text-gray-600">To any destination</div>
//                   </div>
//                 </button>
//               </div>
//             </div>

//             {/* Location List */}
//             <div className="bg-white p-6 rounded-2xl shadow-lg">
//               <h3 className="font-semibold text-gray-900 mb-4">All Locations</h3>
//               <div className="space-y-2 max-h-64 overflow-y-auto">
//                 {locations.map((location) => (
//                   <button
//                     key={location.id}
//                     onClick={() => handleLocationClick(location)}
//                     className={`w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors ${
//                       selectedLocation?.id === location.id ? 'bg-primary-50 border border-primary-200' : ''
//                     }`}
//                   >
//                     <div 
//                       className="w-3 h-3 rounded-full"
//                       style={{ backgroundColor: getLocationColor(location.type) }}
//                     ></div>
//                     <span className="text-sm font-medium text-gray-900">{location.name}</span>
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StationMap;


import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigation, MapPin, Coffee, ListRestart as Restroom, Car, ShoppingBag, Utensils, CreditCard, Users, Accessibility, Volume2, Languages } from 'lucide-react';

const StationMap = () => {
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [navigationPath, setNavigationPath] = useState(null);
  const [userLocation, setUserLocation] = useState({ x: 50, y: 300 });
  const [isNavigating, setIsNavigating] = useState(false);
  const mapRef = useRef(null);

  const amenities = [
    { id: '1', name: 'Restroom (Men)', category: 'restroom', location: { x: 150, y: 200 }, isAccessible: true, isOpen: true },
    { id: '2', name: 'Restroom (Women)', category: 'restroom', location: { x: 150, y: 250 }, isAccessible: true, isOpen: true },
    { id: '3', name: 'Food Court', category: 'food', location: { x: 300, y: 180 }, isAccessible: true, isOpen: true },
    { id: '4', name: 'ATM', category: 'banking', location: { x: 100, y: 150 }, isAccessible: true, isOpen: true },
    { id: '5', name: 'Waiting Hall', category: 'waiting', location: { x: 250, y: 120 }, isAccessible: true, isOpen: true },
    { id: '6', name: 'Platform 1', category: 'platform', location: { x: 400, y: 100 }, isAccessible: true, isOpen: true },
    { id: '7', name: 'Platform 2', category: 'platform', location: { x: 400, y: 200 }, isAccessible: true, isOpen: true },
    { id: '8', name: 'Platform 3', category: 'platform', location: { x: 400, y: 300 }, isAccessible: true, isOpen: true },
    { id: '9', name: 'Ticket Counter', category: 'services', location: { x: 120, y: 100 }, isAccessible: true, isOpen: true },
    { id: '10', name: 'Information Desk', category: 'services', location: { x: 200, y: 80 }, isAccessible: true, isOpen: true },
    { id: '11', name: 'Coffee Shop', category: 'food', location: { x: 350, y: 150 }, isAccessible: true, isOpen: true },
    { id: '12', name: 'Gift Shop', category: 'shopping', location: { x: 280, y: 200 }, isAccessible: true, isOpen: true },
  ];

  const platforms = [
    { id: 'p1', name: 'Platform 1', location: { x: 400, y: 100 }, trains: ['Rajdhani Express'] },
    { id: 'p2', name: 'Platform 2', location: { x: 400, y: 200 }, trains: ['Duronto Express'] },
    { id: 'p3', name: 'Platform 3', location: { x: 400, y: 300 }, trains: ['Shatabdi Express'] },
  ];

  const getIconForCategory = (category) => {
    switch (category) {
      case 'restroom': return Restroom;
      case 'food': return Utensils;
      case 'banking': return CreditCard;
      case 'waiting': return Users;
      case 'platform': return Car;
      case 'services': return MapPin;
      case 'shopping': return ShoppingBag;
      default: return MapPin;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'restroom': return 'bg-blue-500';
      case 'food': return 'bg-orange-500';
      case 'banking': return 'bg-green-500';
      case 'waiting': return 'bg-purple-500';
      case 'platform': return 'bg-red-500';
      case 'services': return 'bg-indigo-500';
      case 'shopping': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const navigateToAmenity = (amenity) => {
    const path = {
      from: 'Main Entrance',
      to: amenity.name,
      steps: [
        'Start from the main entrance',
        'Walk straight through the main concourse',
        `Turn ${amenity.location.x > 200 ? 'right' : 'left'} towards ${amenity.category} area`,
        `Arrive at ${amenity.name}`,
      ],
      estimatedTime: Math.ceil(Math.random() * 5) + 2, // 2-7 minutes
    };

    setNavigationPath(path);
    setSelectedAmenity(amenity);
    setIsNavigating(true);

    // Simulate navigation animation
    animateToLocation(amenity.location);
  };

  const animateToLocation = (destination) => {
    const startTime = Date.now();
    const duration = 3000; // 3 seconds
    const startLocation = { ...userLocation };

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const easedProgress = easeInOutQuad(progress);

      const newLocation = {
        x: startLocation.x + (destination.x - startLocation.x) * easedProgress,
        y: startLocation.y + (destination.y - startLocation.y) * easedProgress,
      };

      setUserLocation(newLocation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsNavigating(false);
      }
    };

    animate();
  };

  const handleAmenityClick = (amenity) => {
    setSelectedAmenity(amenity);
  };

  const speakInstructions = () => {
    if (navigationPath && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        `Navigation to ${navigationPath.to}. ${navigationPath.steps.join('. ')}.`
      );
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Interactive Station Map</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Click on any amenity or platform to get navigation directions. Your current location is shown in blue.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Map Area */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Station Layout</h2>
                <div className="flex space-x-4">
                  <button
                    onClick={speakInstructions}
                    disabled={!navigationPath}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Volume2 className="h-4 w-4" />
                    <span>Voice Guide</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    <Languages className="h-4 w-4" />
                    <span>हिंदी</span>
                  </button>
                </div>
              </div>

              {/* 3D Map Container */}
              <div
                ref={mapRef}
                className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-gray-300"
                style={{ height: '500px', width: '100%' }}
              >
                {/* Station Structure */}
                <div className="absolute inset-4 bg-white rounded-lg shadow-inner border border-gray-300">
                  {/* Main Concourse */}
                  <div className="absolute top-10 left-10 right-10 h-20 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-800">Main Concourse</span>
                  </div>

                  {/* Platform Area */}
                  <div className="absolute top-4 right-4 bottom-4 w-24 bg-red-50 rounded-lg border border-red-200 flex flex-col items-center justify-center">
                    <span className="text-xs font-medium text-red-800 mb-2">Platforms</span>
                    {platforms.map((platform, index) => (
                      <div
                        key={platform.id}
                        className="w-16 h-16 bg-red-200 rounded-lg border border-red-300 mb-2 flex flex-col items-center justify-center cursor-pointer hover:bg-red-300 transition-colors"
                        style={{
                          position: 'absolute',
                          left: '4px',
                          top: `${20 + index * 80}px`,
                        }}
                        onClick={() => handleAmenityClick({
                          id: platform.id,
                          name: platform.name,
                          category: 'platform',
                          location: platform.location,
                          isAccessible: true,
                          isOpen: true,
                        })}
                      >
                        <Car className="h-4 w-4 text-red-700" />
                        <span className="text-xs text-red-700">{index + 1}</span>
                      </div>
                    ))}
                  </div>

                  {/* Amenities */}
                  {amenities.map((amenity) => {
                    const Icon = getIconForCategory(amenity.category);
                    const colorClass = getCategoryColor(amenity.category);
                    
                    return (
                      <motion.div
                        key={amenity.id}
                        className={`absolute w-8 h-8 ${colorClass} rounded-lg shadow-lg cursor-pointer hover:scale-110 transition-transform flex items-center justify-center`}
                        style={{
                          left: `${amenity.location.x}px`,
                          top: `${amenity.location.y}px`,
                        }}
                        onClick={() => handleAmenityClick(amenity)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Icon className="h-4 w-4 text-white" />
                        {amenity.isAccessible && (
                          <Accessibility className="absolute -top-1 -right-1 h-3 w-3 text-green-600 bg-white rounded-full" />
                        )}
                      </motion.div>
                    );
                  })}

                  {/* User Location */}
                  <motion.div
                    className="absolute w-6 h-6 bg-blue-600 rounded-full shadow-lg border-2 border-white"
                    style={{
                      left: `${userLocation.x}px`,
                      top: `${userLocation.y}px`,
                    }}
                    animate={{
                      scale: isNavigating ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: isNavigating ? Infinity : 0,
                    }}
                  >
                    <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75"></div>
                  </motion.div>

                  {/* Navigation Path */}
                  {navigationPath && selectedAmenity && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <defs>
                        <marker
                          id="arrowhead"
                          markerWidth="10"
                          markerHeight="7"
                          refX="9"
                          refY="3.5"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 10 3.5, 0 7"
                            fill="#3b82f6"
                          />
                        </marker>
                      </defs>
                      <motion.path
                        d={`M ${userLocation.x} ${userLocation.y} Q ${(userLocation.x + selectedAmenity.location.x) / 2} ${Math.min(userLocation.y, selectedAmenity.location.y) - 30} ${selectedAmenity.location.x} ${selectedAmenity.location.y}`}
                        stroke="#3b82f6"
                        strokeWidth="3"
                        fill="none"
                        markerEnd="url(#arrowhead)"
                        strokeDasharray="10,5"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5 }}
                      />
                    </svg>
                  )}
                </div>

                {/* Entrance */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Main Entrance
                </div>
              </div>

              {/* Legend */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { category: 'restroom', name: 'Restrooms', icon: Restroom },
                  { category: 'food', name: 'Food & Dining', icon: Utensils },
                  { category: 'banking', name: 'Banking', icon: CreditCard },
                  { category: 'services', name: 'Services', icon: MapPin },
                ].map((item) => {
                  const Icon = item.icon;
                  const colorClass = getCategoryColor(item.category);
                  
                  return (
                    <div key={item.category} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 ${colorClass} rounded flex items-center justify-center`}>
                        <Icon className="h-2 w-2 text-white" />
                      </div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Navigation Panel */}
            {navigationPath && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Navigation</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">From: {navigationPath.from}</p>
                    <p className="text-sm text-gray-600">To: {navigationPath.to}</p>
                    <p className="text-sm text-blue-600 font-medium">
                      Est. time: {navigationPath.estimatedTime} minutes
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-900">Directions:</h4>
                    {navigationPath.steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="flex-shrink-0 w-5 h-5 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm text-gray-600">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Selected Amenity Info */}
            {selectedAmenity && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Location Info</h3>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">{selectedAmenity.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${selectedAmenity.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {selectedAmenity.isOpen ? 'Open' : 'Closed'}
                    </span>
                    {selectedAmenity.isAccessible && (
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Wheelchair Accessible
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => navigateToAmenity(selectedAmenity)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Navigate Here
                  </button>
                </div>
              </motion.div>
            )}

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h3>
              <div className="space-y-2">
                {[
                  { name: 'Nearest Restroom', category: 'restroom' },
                  { name: 'Food Court', category: 'food' },
                  { name: 'Platform 1', category: 'platform' },
                  { name: 'Information Desk', category: 'services' },
                ].map((item) => {
                  const amenity = amenities.find(a => a.category === item.category);
                  return (
                    <button
                      key={item.name}
                      onClick={() => amenity && navigateToAmenity(amenity)}
                      className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors text-sm text-gray-700"
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationMap;




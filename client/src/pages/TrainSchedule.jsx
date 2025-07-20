// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Clock, Train, MapPin, AlertCircle, CheckCircle, XCircle, Search } from 'lucide-react';
// import { useSocket } from '../contexts/SocketContext';

// const TrainSchedule = () => {
//   const { trains, isConnected } = useSocket();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState('all');
//   const [filteredTrains, setFilteredTrains] = useState(trains);

//   useEffect(() => {
//     let filtered = trains;

//     // Filter by search term
//     if (searchTerm) {
//       filtered = filtered.filter(
//         train =>
//           train.trainName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           train.trainNumber.includes(searchTerm) ||
//           train.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           train.destination.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }

//     // Filter by status
//     if (filterStatus !== 'all') {
//       filtered = filtered.filter(train => train.status.toLowerCase() === filterStatus.toLowerCase());
//     }

//     setFilteredTrains(filtered);
//   }, [trains, searchTerm, filterStatus]);

//   const getStatusIcon = (status) => {
//     switch (status.toLowerCase()) {
//       case 'on time':
//         return <CheckCircle className="h-5 w-5 text-green-500" />;
//       case 'delayed':
//         return <AlertCircle className="h-5 w-5 text-red-500" />;
//       case 'cancelled':
//         return <XCircle className="h-5 w-5 text-red-600" />;
//       case 'boarding':
//         return <Train className="h-5 w-5 text-blue-500" />;
//       default:
//         return <Clock className="h-5 w-5 text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'on time':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'delayed':
//         return 'bg-red-100 text-red-800 border-red-200';
//       case 'cancelled':
//         return 'bg-red-100 text-red-900 border-red-200';
//       case 'boarding':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const formatTime = (timeString) => {
//     return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="text-center mb-8"
//         >
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Train Schedule</h1>
//           <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//             Real-time train information with live updates and platform details
//           </p>
          
//           {/* Connection Status */}
//           <div className="mt-4 flex items-center justify-center space-x-2">
//             <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
//             <span className="text-sm text-gray-600">
//               {isConnected ? 'Live updates active' : 'Connecting...'}
//             </span>
//           </div>
//         </motion.div>

//         {/* Filters and Search */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.1 }}
//           className="bg-white rounded-xl shadow-lg p-6 mb-8"
//         >
//           <div className="flex flex-col md:flex-row gap-4">
//             {/* Search */}
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//               <input
//                 type="text"
//                 placeholder="Search by train name, number, or station..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>

//             {/* Status Filter */}
//             <div className="md:w-48">
//               <select
//                 value={filterStatus}
//                 onChange={(e) => setFilterStatus(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="all">All Status</option>
//                 <option value="on time">On Time</option>
//                 <option value="delayed">Delayed</option>
//                 <option value="boarding">Boarding</option>
//                 <option value="cancelled">Cancelled</option>
//               </select>
//             </div>
//           </div>
//         </motion.div>

//         {/* Train Cards Grid */}
//         <div className="grid gap-6">
//           {filteredTrains.length > 0 ? (
//             filteredTrains.map((train, index) => (
//               <motion.div
//                 key={train.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: 0.1 * index }}
//                 className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
//                   {/* Train Info */}
//                   <div className="md:col-span-2">
//                     <div className="flex items-center space-x-3 mb-2">
//                       <Train className="h-6 w-6 text-blue-600" />
//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-900">{train.trainName}</h3>
//                         <p className="text-sm text-gray-600">Train #{train.trainNumber}</p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center space-x-2 text-gray-600">
//                       <MapPin className="h-4 w-4" />
//                       <span className="text-sm">{train.source} → {train.destination}</span>
//                     </div>
//                   </div>

//                   {/* Platform and Coach */}
//                   <div className="text-center md:text-left">
//                     <div className="bg-blue-50 rounded-lg p-3 mb-2">
//                       <p className="text-sm text-blue-600 font-medium">{train.platform}</p>
//                       <p className="text-xs text-blue-500">Coach: {train.coach}</p>
//                     </div>
//                   </div>

//                   {/* Time and Status */}
//                   <div className="text-center md:text-right">
//                     <div className="space-y-2">
//                       <div>
//                         <p className="text-sm text-gray-600">Scheduled: {formatTime(train.scheduledTime)}</p>
//                         <p className="text-lg font-semibold text-gray-900">
//                           Expected: {formatTime(train.estimatedTime)}
//                         </p>
//                       </div>
                      
//                       <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(train.status)}`}>
//                         {getStatusIcon(train.status)}
//                         <span className="text-sm font-medium">{train.status}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Delay Warning */}
//                 {train.status === 'Delayed' && train.scheduledTime !== train.estimatedTime && (
//                   <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                     <div className="flex items-center space-x-2">
//                       <AlertCircle className="h-4 w-4 text-red-500" />
//                       <span className="text-sm text-red-700">
//                         Running {Math.ceil(
//                           (new Date(`2000-01-01T${train.estimatedTime}`).getTime() - 
//                            new Date(`2000-01-01T${train.scheduledTime}`).getTime()) / 60000
//                         )} minutes late
//                       </span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Boarding Alert */}
//                 {train.status === 'Boarding' && (
//                   <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                     <div className="flex items-center space-x-2">
//                       <Train className="h-4 w-4 text-blue-500" />
//                       <span className="text-sm text-blue-700">
//                         Now boarding on {train.platform}. Please proceed to the platform.
//                       </span>
//                     </div>
//                   </div>
//                 )}
//               </motion.div>
//             ))
//           ) : (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="text-center py-12"
//             >
//               <Train className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No trains found</h3>
//               <p className="text-gray-600">
//                 {searchTerm || filterStatus !== 'all'
//                   ? 'Try adjusting your search criteria'
//                   : 'No train data available at the moment'}
//               </p>
//             </motion.div>
//           )}
//         </div>

//         {/* Statistics */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.3 }}
//           className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
//         >
//           {[
//             { label: 'Total Trains', value: trains.length, color: 'bg-blue-500' },
//             { label: 'On Time', value: trains.filter(t => t.status === 'On Time').length, color: 'bg-green-500' },
//             { label: 'Delayed', value: trains.filter(t => t.status === 'Delayed').length, color: 'bg-red-500' },
//             { label: 'Boarding', value: trains.filter(t => t.status === 'Boarding').length, color: 'bg-yellow-500' },
//           ].map((stat, index) => (
//             <div key={stat.label} className="bg-white rounded-lg shadow p-4 text-center">
//               <div className={`w-3 h-3 ${stat.color} rounded-full mx-auto mb-2`}></div>
//               <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
//               <p className="text-sm text-gray-600">{stat.label}</p>
//             </div>
//           ))}
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default TrainSchedule;


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Train, MapPin, AlertCircle, CheckCircle, XCircle, Search } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';

const TrainSchedule = () => {
  const { trains = [], isConnected } = useSocket();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredTrains, setFilteredTrains] = useState([]);

  useEffect(() => {
    let filtered = Array.isArray(trains) ? [...trains] : [];

    if (searchTerm) {
      filtered = filtered.filter(
        train =>
          (train.trainName && train.trainName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (train.trainNumber && train.trainNumber.includes(searchTerm)) ||
          (train.source && train.source.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (train.destination && train.destination.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(
        train => train.status && train.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    setFilteredTrains(filtered);
  }, [trains, searchTerm, filterStatus]);

  const getStatusIcon = (status) => {
    if (!status) return <Clock className="h-5 w-5 text-gray-500" />;
    
    switch (status.toLowerCase()) {
      case 'on time':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'delayed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'boarding':
        return <Train className="h-5 w-5 text-blue-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    switch (status.toLowerCase()) {
      case 'on time':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delayed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-red-100 text-red-900 border-red-200';
      case 'boarding':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '--:--';
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return '--:--';
    }
  };

  const calculateDelayMinutes = (scheduledTime, estimatedTime) => {
    if (!scheduledTime || !estimatedTime) return 0;
    try {
      return Math.ceil(
        (new Date(`2000-01-01T${estimatedTime}`).getTime() - 
        new Date(`2000-01-01T${scheduledTime}`).getTime()
      ) / 60000);
    } catch (e) {
      return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Train Schedule</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time train information with live updates and platform details
          </p>
          
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Live updates active' : 'Connecting...'}
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by train name, number, or station..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="on time">On Time</option>
                <option value="delayed">Delayed</option>
                <option value="boarding">Boarding</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6">
          {filteredTrains.length > 0 ? (
            filteredTrains.map((train, index) => (
              <motion.div
                key={train.id || `train-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div className="md:col-span-2">
                    <div className="flex items-center space-x-3 mb-2">
                      <Train className="h-6 w-6 text-blue-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{train.trainName || 'Unknown Train'}</h3>
                        <p className="text-sm text-gray-600">Train #{train.trainNumber || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">
                        {train.source || 'Unknown'} → {train.destination || 'Unknown'}
                      </span>
                    </div>
                  </div>

                  <div className="text-center md:text-left">
                    <div className="bg-blue-50 rounded-lg p-3 mb-2">
                      <p className="text-sm text-blue-600 font-medium">{train.platform || '--'}</p>
                      <p className="text-xs text-blue-500">Coach: {train.coach || '--'}</p>
                    </div>
                  </div>

                  <div className="text-center md:text-right">
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Scheduled: {formatTime(train.scheduledTime)}</p>
                        <p className="text-lg font-semibold text-gray-900">
                          Expected: {formatTime(train.estimatedTime)}
                        </p>
                      </div>
                      
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(train.status)}`}>
                        {getStatusIcon(train.status)}
                        <span className="text-sm font-medium">{train.status || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {train.status === 'Delayed' && train.scheduledTime !== train.estimatedTime && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-700">
                        Running {calculateDelayMinutes(train.scheduledTime, train.estimatedTime)} minutes late
                      </span>
                    </div>
                  </div>
                )}

                {train.status === 'Boarding' && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Train className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-blue-700">
                        Now boarding on {train.platform || 'platform'}. Please proceed to the platform.
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Train className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trains found</h3>
              <p className="text-gray-600">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'No train data available at the moment'}
              </p>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Trains', value: trains?.length || 0, color: 'bg-blue-500' },
            { label: 'On Time', value: trains?.filter(t => t?.status === 'On Time').length || 0, color: 'bg-green-500' },
            { label: 'Delayed', value: trains?.filter(t => t?.status === 'Delayed').length || 0, color: 'bg-red-500' },
            { label: 'Boarding', value: trains?.filter(t => t?.status === 'Boarding').length || 0, color: 'bg-yellow-500' },
          ].map((stat, index) => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-4 text-center">
              <div className={`w-3 h-3 ${stat.color} rounded-full mx-auto mb-2`}></div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TrainSchedule;
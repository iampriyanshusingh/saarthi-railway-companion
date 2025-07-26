// import React, { useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { Train, Menu, X, User, LogOut, Settings, Map } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext.jsx';

// const Navbar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { user, logout } = useAuth();
//   const location = useLocation();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//     setIsOpen(false);
//   };

//   const NavLink = ({ to, children, icon: Icon }) => {
//     const isActive = location.pathname === to;
//     return (
//       <Link
//         to={to}
//         className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
//           isActive
//             ? 'bg-primary-100 text-primary-700'
//             : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
//         }`}
//         onClick={() => setIsOpen(false)}
//       >
//         {Icon && <Icon className="w-4 h-4" />}
//         <span>{children}</span>
//       </Link>
//     );
//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
//               <Train className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-xl font-bold text-gray-900">Saarthi</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-1">
//             <NavLink to="/">Home</NavLink>
//             <NavLink to="/map" icon={Map}>Station Map</NavLink>
//             {user && (
//               <>
//                 <NavLink to="/dashboard">Dashboard</NavLink>
//                 {user.role === 'admin' && (
//                   <NavLink to="/admin">Admin Panel</NavLink>
//                 )}
//               </>
//             )}
//           </div>

//           {/* User Menu */}
//           <div className="hidden md:flex items-center space-x-4">
//             {user ? (
//               <div className="flex items-center space-x-2">
//                 <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg">
//                   <User className="w-4 h-4 text-gray-600" />
//                   <span className="text-sm font-medium text-gray-700">
//                     {user.name}
//                   </span>
//                 </div>
//                 <Link
//                   to="/profile"
//                   className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <Settings className="w-4 h-4" />
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                 >
//                   <LogOut className="w-4 h-4" />
//                 </button>
//               </div>
//             ) : (
//               <Link
//                 to="/auth"
//                 className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
//               >
//                 Sign In
//               </Link>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsOpen(!isOpen)}
//               className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
//             >
//               {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Navigation */}
//       {isOpen && (
//         <div className="md:hidden bg-white border-t border-gray-200">
//           <div className="px-4 py-3 space-y-1">
//             <NavLink to="/">Home</NavLink>
//             <NavLink to="/map" icon={Map}>Station Map</NavLink>
//             {user && (
//               <>
//                 <NavLink to="/dashboard">Dashboard</NavLink>
//                 {user.role === 'admin' && (
//                   <NavLink to="/admin">Admin Panel</NavLink>
//                 )}
//                 <NavLink to="/profile" icon={Settings}>Profile</NavLink>
//                 <button
//                   onClick={handleLogout}
//                   className="flex items-center space-x-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   <span>Logout</span>
//                 </button>
//               </>
//             )}
//             {!user && (
//               <Link
//                 to="/auth"
//                 className="block px-3 py-2 bg-primary-600 text-white rounded-lg text-center"
//                 onClick={() => setIsOpen(false)}
//               >
//                 Sign In
//               </Link>
//             )}
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Train,
  Map,
  Clock,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { IoCalendarOutline } from "react-icons/io5";
import { useAuth } from "../contexts/AuthContext";
import GoogleTranslate from "../utils/Lang/Language";
import { motion } from "framer-motion";
import ThemeChange from "../utils/theme/DarkTheme";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: Train },
    { name: "Station Map", href: "/map", icon: Map },
    { name: "Train Schedule", href: "/schedule", icon: Clock },
    { name: "Booking", href: "/booking", icon: IoCalendarOutline },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <>
      <nav className="bg-white dark:bg-gray-900 shadow-lg fixed w-full top-0 z-50 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Train className="h-8 w-8 text-blue-600" />
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Saarthi
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-yellow-500 py-2 px-6 flex justify-between items-center text-sm"
                  >
                    <div className="flex space-x-4"></div>
                    <GoogleTranslate />
                    <ThemeChange />
                  </motion.div>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium">{user.name}</span>
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Profile & Settings
                      </Link>
                      {user.email === "admin@saarthi.com" && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* <Link
                  to="/auth"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 text-sm font-medium transition-colors"
                >
                  Sign in
                </Link> */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white dark:bg-gray-800 py-2 px-6 flex justify-between items-center text-sm"
                  >
                    <div className="flex space-x-4"></div>
                    <GoogleTranslate />
                    <ThemeChange />
                  </motion.div>
                  <Link
                    to="/auth"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign in
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none focus:text-blue-600"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-gray-800"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Profile & Settings</span>
                  </Link>
                  {user.email === "admin@saarthi.com" && (
                    <Link
                      to="/admin"
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 w-full text-left"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Sign out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/auth"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;

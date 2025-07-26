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
    <nav className="bg-white dark:bg-gray-900 shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Train className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Saarthi
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
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

          {/* Controls and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <GoogleTranslate />
              <ThemeChange />
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user.name}</span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Profile & Settings
                    </Link>
                    {user.email === "admin@saarthi.com" && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
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

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-2">
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
            <Link
              to="/auth"
              className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => setIsOpen(false)}
            >
              Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

import HeroSection from "./Components/HeroSection";
import FeaturesSection from "./Components/FeaturesSection";
import TrainSchedule from "./Components/TrainSchedule";
import SignInPage from "./Components/SignInPage";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import LucidIcon from "./Components/LucidIcon";
import AIAssistantButton from "./Components/AIAssistantButton";
import StationNavigator from "./Components/StationNavigator";

const App = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Define sections for primary navigation (excluding AI Assistant)
  const navSections = [
    {
      id: "3d-maps",
      name: "3D Maps",
      icon: "Map",
      description:
        "🗺️ Navigate complex stations with interactive 3D maps and real-time step-by-step directions.",
      image:
        "https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "train-schedule",
      name: "Train Schedule",
      icon: "Clock",
      description:
        "⏰ Access up-to-the-minute train schedules, delays, and platform changes at a glance.",
      image:
        "https://images.unsplash.com/photo-1544620301-f212d1b0d2d3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8M",
    },
    {
      id: "booking",
      name: "Booking",
      icon: "Ticket",
      description: "🎟️ Book your train tickets quickly and securely.",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961dde?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "sign-in",
      name: "Sign In",
      icon: "LogIn",
      description: "🔑 Securely sign in to access personalized features.",
      image:
        "https://images.unsplash.com/photo-1512486130939-2c4f79935d4f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  // All features for the timeline (including AI Assistant and Live Updates)
  const allFeatures = [
    ...navSections,
    {
      id: "ai-assistant",
      name: "AI Assistant",
      icon: "MessageSquareText",
      description:
        "🤖 Get instant answers to all your railway queries with our intelligent chatbot.",
      image:
        "https://images.unsplash.com/photo-1620712948680-f027871b695e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: "live-updates",
      name: "Live Updates",
      icon: "Bell",
      description:
        "🔔 Stay informed with real-time alerts on train movements, platform changes, and announcements.",
      image:
        "https://images.unsplash.com/photo-1557426272-a953e545082e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const renderSectionContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <>
            <HeroSection setActiveSection={setActiveSection} />
            <FeaturesSection
              allFeatures={allFeatures}
              activeSection={activeSection}
            />
          </>
        );
      case "train-schedule":
        return <TrainSchedule />;
      case "sign-in":
        return <SignInPage />; // Render the new SignInPage
      case "3d-maps":
        return <StationNavigator />; // Render the StationNavigator for 3D Maps
      case "ai-assistant":
      case "booking":
      case "live-updates":
        // For individual section views, render the single FeatureBlock within a styled container
        const currentFeature = allFeatures.find((f) => f.id === activeSection);
        if (!currentFeature) return null;

        return (
          <div className="p-8 animate-fade-in bg-gray-900 rounded-3xl shadow-2xl border border-gray-700 max-w-4xl mx-auto my-8">
            <FeaturesSection
              allFeatures={[currentFeature]}
              activeSection={activeSection}
              isSingleFeature={true}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-800 text-gray-100 font-inter flex flex-col">
      {/* Tailwind CSS CDN */}
      <script src="https://cdn.tailwindcss.com"></script>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
        integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUzyjAxoOiaR8KzPOa/s/asjrQ5L4A6ZGgFuCqX"
        crossOrigin=""
      />
      {/* Leaflet JS */}
      <script
        src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"
        integrity="sha256-WBkoXOwTeyKclOHuWtc+iLgNGz4igTJPBeS5fF8rSl0="
        crossOrigin=""
      ></script>
      {/* React-Leaflet JS - Make sure it's loaded AFTER React and Leaflet */}
      <script src="https://unpkg.com/react-leaflet@4.2.1/dist/react-leaflet.min.js"></script>
      <script>
        {`
          // Expose ReactLeaflet components globally for use without direct import
          window.ReactLeaflet = {
            MapContainer: ReactLeaflet.MapContainer,
            TileLayer: ReactLeaflet.TileLayer,
            Marker: ReactLeaflet.Marker,
            Popup: ReactLeaflet.Popup,
            Polyline: ReactLeaflet.Polyline
          };
        `}
      </script>

      {/* Google Translate scripts - Placed globally for whole page translation */}
      <script type="text/javascript">
        {`
        function googleTranslateElementInit() {
          // Initialize for desktop widget
          if (document.getElementById('google_translate_element_desktop')) {
            new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element_desktop');
          }
          // Initialize for mobile widget
          if (document.getElementById('google_translate_element_mobile')) {
            new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE}, 'google_translate_element_mobile');
          }
        }
        `}
      </script>
      <script
        type="text/javascript"
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      ></script>

      {/* Custom Tailwind CSS for animations and timeline */}
      <style>
        {`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        @keyframes bell-ring {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(15deg); }
          30% { transform: rotate(-15deg); }
          45% { transform: rotate(10deg); }
          60% { transform: rotate(-10deg); }
          75% { transform: rotate(5deg); }
          90% { transform: rotate(-5deg); }
        }
        .animate-bell-ring {
          animation: bell-ring 2s ease-in-out infinite;
        }

        /* Timeline specific styles (for Home page features) */
        .timeline-item {
          position: relative;
          padding-left: 0;
          padding-right: 0;
        }

        /* The main vertical line */
        #timeline-vertical-line {
          height: 0;
        }

        /* Horizontal connecting line */
        .timeline-horizontal-line {
            position: absolute;
            top: 50%;
            width: 20px; /* Length of the horizontal line */
            height: 2px;
            background-color: #6366F1; /* Blue-600 */
            transform: translateY(-50%);
            z-index: 5;
        }

        .timeline-horizontal-line-left {
            right: calc(50% + 1px); /* Connects to the left side of the vertical line */
        }

        .timeline-horizontal-line-right {
            left: calc(50% + 1px); /* Connects to the right side of the vertical line */
        }

        /* Adjustments for content alignment relative to the timeline line */
        .timeline-item.md\\:flex-row > div:first-child { /* Image container (left side) */
            padding-right: 2rem;
            justify-content: flex-end;
            text-align: right;
        }
        .timeline-item.md\\:flex-row > div:last-child { /* Text container (left side) */
            padding-left: 2rem;
            justify-content: flex-start;
            text-align: left;
        }

        .timeline-item.md\\:flex-row-reverse > div:first-child { /* Text container (right side) */
            padding-left: 2rem;
            justify-content: flex-start;
            text-align: left;
        }
        .timeline-item.md\\:flex-row-reverse > div:last-child { /* Image container (right side) */
            padding-right: 2rem;
            justify-content: flex-end;
            text-align: right;
        }

        /* On desktop, ensure the content divs take up half width */
        .timeline-item .md\\:w-1\\/2 {
            width: 50%;
        }

        /* For mobile, remove timeline lines and stack content normally */
        @media (max-width: 767px) {
          .timeline-horizontal-line {
            display: none !important;
          }
          #timeline-vertical-line {
            display: none !important;
          }
          .timeline-item {
            padding-left: 0;
            padding-right: 0;
            flex-direction: column !important;
            text-align: center;
          }
          .timeline-item > div { /* Both image and text containers */
            width: 100% !important;
            padding: 1rem;
          }
          .timeline-item.md\\:flex-row > div:first-child,
          .timeline-item.md\\:flex-row > div:last-child,
          .timeline-item.md\\:flex-row-reverse > div:first-child,
          .timeline-item.md\\:flex-row-reverse > div:last-child {
            padding-left: 1rem;
            padding-right: 1rem;
            justify-content: center;
            text-align: center;
          }
          .timeline-item .p-3 { /* Icon background */
            margin-left: auto;
            margin-right: auto;
          }
        }
        `}
      </style>

      <Header
        navSections={navSections}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        setIsNavOpen={setIsNavOpen}
        isNavOpen={isNavOpen}
      />

      {/* Mobile Navigation Sidebar */}
      {isNavOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-950 bg-opacity-98 z-40 flex flex-col p-6 animate-fade-in">
          <button
            onClick={() => setIsNavOpen(false)}
            className="self-end p-2 rounded-md text-gray-300 hover:bg-gray-700 mb-6 transition-colors duration-200"
          >
            <LucidIcon name="X" className="w-8 h-8" />
          </button>
          <nav className="flex flex-col space-y-5">
            {navSections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  setIsNavOpen(false);
                }}
                className={`flex items-center px-5 py-4 rounded-xl text-left transition-all duration-300 text-2xl font-semibold
                  ${
                    activeSection === section.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg"
                      : section.id === "sign-in" // Apply button styling for Sign In in mobile nav
                      ? "bg-blue-700 text-white hover:bg-blue-600 shadow-md"
                      : "text-gray-300 hover:bg-gray-700 hover:text-blue-300"
                  }`}
              >
                <LucidIcon name={section.icon} className="w-8 h-8 mr-4" />
                <span className="text-xl">{section.name}</span>
              </button>
            ))}
            <button
              onClick={() => {
                setActiveSection("home");
                setIsNavOpen(false);
              }}
              className={`flex items-center px-5 py-4 rounded-xl text-left transition-all duration-300 text-2xl font-semibold
                  ${
                    activeSection === "home"
                      ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg"
                      : "text-gray-300 hover:bg-gray-700 hover:text-blue-300"
                  }`}
            >
              <LucidIcon name="TrainFront" className="w-8 h-8 mr-4" />
              <span className="text-xl">Home</span>
            </button>
            {/* Google Translate element for mobile */}
            <div
              id="google_translate_element_mobile"
              className="mt-6 p-4 bg-gray-800 rounded-lg shadow-inner"
            ></div>
          </nav>
        </div>
      )}

      <main className="flex-1 p-0 overflow-auto">{renderSectionContent()}</main>

      <AIAssistantButton setActiveSection={setActiveSection} />

      <Footer />
    </div>
  );
};

export default App;

import React, { useState, useEffect, useRef } from "react";
import FeatureBlock from "./FeatureBlock";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const FeaturesSection = ({
  allFeatures,
  activeSection,
  isSingleFeature = false,
}) => {
  // Framer Motion controls for timeline line animation
  const lineControls = useAnimation();
  const [lineRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (activeSection === "home" && inView && !isSingleFeature) {
      lineControls.start({ height: "100%" });
    } else {
      lineControls.start({ height: "0%" });
    }
  }, [activeSection, inView, lineControls, isSingleFeature]);

  const featuresToDisplay = isSingleFeature
    ? allFeatures
    : allFeatures.filter((f) => f.id !== "ai-assistant"); // AI Assistant is a separate button

  return (
    <section className="py-8 md:py-12 relative max-w-4xl mx-auto px-4 md:px-12">
      {!isSingleFeature && (
        <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-green-500 mb-12 md:mb-20 text-center">
          Explore Saarthi's Core Features
        </h3>
      )}
      {/* Vertical timeline line for animation - Desktop only, and only on home page */}
      {activeSection === "home" && !isSingleFeature && (
        <motion.div
          id="timeline-vertical-line"
          className="absolute left-1/2 top-20 md:top-40 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-purple-700 transform -translate-x-1/2 origin-top"
          initial={{ height: "0%" }}
          animate={lineControls}
          transition={{ duration: 1.5, ease: "easeInOutQuad" }}
          ref={lineRef}
        ></motion.div>
      )}
      <div className="space-y-8 md:space-y-12">
        {featuresToDisplay.map((feature, index) => (
          <FeatureBlock
            key={feature.id}
            id={feature.id}
            name={feature.name}
            description={feature.description}
            icon={feature.icon}
            image={feature.image}
            isReversed={index % 2 !== 0 && !isSingleFeature} // Only reverse on home page, not for single feature display
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;

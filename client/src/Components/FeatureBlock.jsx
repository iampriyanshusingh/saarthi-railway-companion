import React, { useState, useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import LucidIcon from "./LucidIcon";
import { useInView } from "react-intersection-observer";

const FeatureBlock = ({
  id,
  name,
  description,
  icon: IconName,
  image,
  isReversed,
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      id={id}
      className={`timeline-item mb-10 md:mb-16 relative flex flex-col md:flex-row items-center ${
        isReversed ? "md:justify-end md:flex-row-reverse" : "md:justify-start"
      }`}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {/* Horizontal line connecting to content - Desktop only */}
      <div
        className={`timeline-horizontal-line hidden md:block ${
          isReversed
            ? "timeline-horizontal-line-right"
            : "timeline-horizontal-line-left"
        }`}
      ></div>

      {/* Content (Image and Text) */}
      <div
        className={`w-full md:w-1/2 flex justify-center items-center p-4 md:p-0 ${
          isReversed ? "md:justify-start md:pl-10" : "md:justify-end md:pr-10"
        }`}
      >
        <img
          src={image}
          alt={`${name} illustration`}
          className="rounded-lg shadow-xl max-w-full h-auto object-cover border border-gray-600"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/400x300/374151/9CA3AF?text=Image+Missing";
          }}
          style={{
            minWidth: "180px",
            minHeight: "120px",
            maxWidth: "400px",
            maxHeight: "300px",
          }}
        />
      </div>
      <div
        className={`w-full md:w-1/2 p-4 md:p-6 max-w-md ${
          isReversed ? "md:text-right md:pl-10" : "md:text-left md:pr-10"
        } text-center`}
      >
        <div
          className={`inline-block mb-3 md:mb-4 ${
            isReversed ? "md:ml-auto md:mr-0" : "md:mr-auto md:ml-0"
          }`}
        >
          {IconName && (
            <LucidIcon
              name={IconName}
              className="w-7 h-7 md:w-8 md:h-8 text-blue-400"
            />
          )}
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-50 mb-2 md:mb-3">
          {name}
        </h3>
        <p className="text-gray-300 text-base md:text-lg leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default FeatureBlock;

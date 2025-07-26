import { motion, useAnimation, AnimatePresence } from "framer-motion";
import LucidIcon from "./LucidIcon";

const AIAssistantButton = ({ setActiveSection }) => {
  return (
    <motion.button
      className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-3 md:p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-40 flex items-center justify-center"
      onClick={() => setActiveSection("ai-assistant")}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      whileHover={{ rotate: 15 }}
      whileTap={{ scale: 0.9 }}
    >
      <LucidIcon name="MessageSquareText" className="w-6 h-6 md:w-8 md:h-8" />
      <span className="sr-only">AI Assistant</span> {/* For accessibility */}
    </motion.button>
  );
};

export default AIAssistantButton;

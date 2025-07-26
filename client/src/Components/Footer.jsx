const Footer = () => {
  return (
    <footer className="bg-gray-900 bg-opacity-80 backdrop-blur-sm p-6 text-center text-gray-400 text-sm shadow-inner border-t border-gray-700">
      &copy; {new Date().getFullYear()} Saarthi. All rights reserved. Designed
      with <span className="text-red-500">&hearts;</span> for seamless journeys.
    </footer>
  );
};

export default Footer;

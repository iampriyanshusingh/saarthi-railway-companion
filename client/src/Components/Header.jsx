import LucidIcon from "./LucidIcon";

const Header = ({
  navSections,
  activeSection,
  setActiveSection,
  setIsNavOpen,
  isNavOpen,
}) => {
  return (
    <header className="bg-gray-900 bg-opacity-80 backdrop-blur-sm p-4 shadow-xl flex justify-between items-center sticky top-0 z-50 border-b border-gray-700">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => setActiveSection("home")}
      >
        <LucidIcon
          name="TrainFront"
          className="w-10 h-10 text-blue-400 mr-3 animate-pulse-slow"
        />
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-400">
          Saarthi
        </h1>
      </div>
      <nav className="hidden md:flex items-center space-x-6">
        {navSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center px-4 py-2 rounded-full transition-all duration-300 text-lg font-medium
              ${
                activeSection === section.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white shadow-lg scale-105"
                  : section.id === "sign-in"
                  ? "bg-blue-700 text-white hover:bg-blue-600 shadow-md"
                  : "text-gray-300 hover:bg-gray-700 hover:text-blue-300 hover:shadow-md"
              }`}
          >
            <LucidIcon name={section.icon} className="w-6 h-6 mr-2" />
            {section.name}
          </button>
        ))}
      </nav>
      {/* Google Translate element for desktop */}
      <div
        id="google_translate_element_desktop"
        className="hidden md:block ml-4"
      ></div>
      <div className="md:hidden">
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="p-2 rounded-md text-gray-300 hover:bg-gray-700 transition-colors duration-200"
        >
          {isNavOpen ? (
            <LucidIcon name="X" className="w-8 h-8" />
          ) : (
            <LucidIcon name="Menu" className="w-8 h-8" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;

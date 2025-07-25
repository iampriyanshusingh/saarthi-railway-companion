import React, { useState, useEffect } from "react";
import { IoCalendarOutline, IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import default styles

const BookingPage = () => {
  const [station, setStation] = useState("");
  const [selectedStation, setSelectedStation] = useState(null);
  const [date, setDate] = useState(null); // Date initialized as null
  const [services, setServices] = useState([
    { id: "cloak", name: "Cloak Room Booking", availability: 0 },
    { id: "wheelchair", name: "Wheelchair Booking", availability: 0 },
    { id: "coolie", name: "Coolie Booking", availability: 0 },
  ]);
  const [buttonClicked, setButtonClicked] = useState(false);

  const [stationSuggestions, setStationSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // Fetch station suggestions
  const fetchStationSuggestions = async (query) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/station/`);
      if (response.data.length > 0) {
        setStationSuggestions(response.data);
        setNoResults(false);
      } else {
        setStationSuggestions([]);
        setNoResults(true);
      }
    } catch (err) {
      setError("Error fetching station suggestions. Please try again.");
      setNoResults(false);
    }
  };

  // Fetch service data for the selected station
  const fetchServiceData = async (stationId) => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BACKEND_URL}/station/${stationId}/bookings`
      );
      const { coolieBookings, wheelchairBookings, cloakroomBookings } =
        response.data;

      setServices([
        {
          id: "cloak",
          name: "Cloak Room Booking",
          availability: cloakroomBookings.length,
        },
        {
          id: "wheelchair",
          name: "Wheelchair Booking",
          availability: wheelchairBookings.length,
        },
        {
          id: "coolie",
          name: "Coolie Booking",
          availability: coolieBookings.length,
        },
      ]);

      setLoading(false);
    } catch (err) {
      setError("Error fetching service data. Please try again.");
      setLoading(false);
    }
  };

  // Update service data when the selected station changes
  useEffect(() => {
    if (selectedStation) {
      fetchServiceData(selectedStation._id);
    }
  }, [selectedStation]);

  // Handle station input change
  const handleStationInputChange = (e) => {
    const value = e.target.value;
    setStation(value);
    setError("");

    if (value.length > 2) {
      fetchStationSuggestions(value);
    } else {
      setStationSuggestions([]);
      setNoResults(false);
    }
  };

  // Handle station selection from suggestions
  const handleStationSelect = (station) => {
    setSelectedStation(station);
    setStation(station.name);
    setStationSuggestions([]);
    setError("");
  };

  // Handle booking action based on selected service
  const handleBookNow = (serviceId) => {
    setButtonClicked(true);
    setSelectedService(serviceId);
    setFormData({});
  };

  // Booking methods (Cloakroom, Coolie, Wheelchair)
  const bookCloakroom = async () => {
    try {
      const requestBody = {
        station: selectedStation._id,
        items: formData.items,
        startDate: formData.startDate,
        endDate: formData.endDate,
        price: 100,
      };

      await axios.post(`${BACKEND_URL}/api/bookCloakroom`, requestBody);
      alert("Cloakroom booking successful!");
    } catch (error) {
      alert(
        "Failed to complete the booking: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  const bookCoolie = async () => {
    try {
      const requestBody = {
        station: selectedStation._id,
        pickupLocation: formData.pickupLocation,
        departureLocation: formData.departureLocation,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        price: 250,
      };

      await axios.post(`${BACKEND_URL}/api/bookCoolie`, requestBody);
      alert("Coolie booking successful!");
    } catch (error) {
      alert(
        "Failed to complete the booking: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  const bookWheelchair = async () => {
    try {
      const requestBody = {
        station: selectedStation._id,
        bookingDate: formData.bookingDate,
        bookingTime: formData.bookingTime,
        price: 200,
      };

      await axios.post(`${BACKEND_URL}/api/bookWheelchair`, requestBody);
      alert("Wheelchair booking successful!");
    } catch (error) {
      alert(
        "Failed to complete the booking: " +
          (error.response?.data?.message || "Unknown error")
      );
    }
  };

  // Handle form submission based on selected service
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedService === "cloak") {
      await bookCloakroom();
    } else if (selectedService === "coolie") {
      await bookCoolie();
    } else if (selectedService === "wheelchair") {
      await bookWheelchair();
    }
  };

  // Render booking form for selected service

  const renderBookingForm = () => {
    // Calender validation code start
    const [minDate, setMinDate] = useState(
      new Date().toISOString().split("T")[0]
    );
    // Calender validation code end

    if (!selectedService) return null;

    if (selectedService === "cloak") {
      return (
        <div className="flex w-full justify-center ">
          <form
            onSubmit={handleFormSubmit}
            className="mt-6   flex flex-col w-8/12"
          >
            <h2 className="text-2xl font-bold text-center text-blue-600 underline underline-offset-4">
              Cloak Room Booking
            </h2>
            <label className="block mt-4 text-left">Number of Items: </label>
            <input
              type="number"
              value={formData.items || ""}
              onChange={(e) =>
                setFormData({ ...formData, items: e.target.value })
              }
              required
              className=" w-full px-4 py-2 mt-2 transition duration-200 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <label className="block mt-4">Start Date: </label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => setFormData({ ...formData, startDate: date })}
              minDate={minDate} // Setting minimum date to today
              className="w-full px-4 py-2 mt-2 transition duration-200 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <label className="block mt-4">End Date: </label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) => setFormData({ ...formData, endDate: date })}
              minDate={minDate} // Setting minimum date to today
              className="w-full px-4 py-2 mt-2 transition duration-200 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <button
              type="submit"
              className="px-5 py-3 mt-6 hover:text-white font-bold transition-all  bg-blue-50  duration-300 border-2 text-blue-500 border-blue-500 rounded-lg shadow-md hover:bg-blue-600"
            >
              Submit Booking
            </button>
          </form>
        </div>
      );
    } else if (selectedService === "coolie") {
      return (
        <div className="flex justify-center w-full ">
          <form
            onSubmit={handleFormSubmit}
            className="mt-6 flex flex-col w-8/12"
          >
            <h2 className="text-2xl font-bold text-blue-600 text-center underline underline-offset-4">
              Coolie Booking
            </h2>
            <label className="block mt-4">Pickup Location:</label>
            <input
              type="text"
              value={formData.pickupLocation || ""}
              onChange={(e) =>
                setFormData({ ...formData, pickupLocation: e.target.value })
              }
              required
              className="w-full px-4 py-2 mt-2 transition duration-200 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <label className="block mt-4">Departure Location: </label>
            <input
              type="text"
              value={formData.departureLocation || ""}
              onChange={(e) =>
                setFormData({ ...formData, departureLocation: e.target.value })
              }
              required
              className="w-full px-4 py-2 mt-2 transition duration-200 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <label className="block mt-4">Booking Date:</label>
            <DatePicker
              selected={formData.bookingDate}
              onChange={(date) =>
                setFormData({ ...formData, bookingDate: date })
              }
              minDate={minDate} // Setting minimum date to today
              className="w-full px-4 py-2 mt-2 transition duration-200 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <label className="block mt-4">Booking Time:</label>
            <input
              type="time"
              value={formData.bookingTime || ""}
              onChange={(e) =>
                setFormData({ ...formData, bookingTime: e.target.value })
              }
              required
              className="w-full px-4 py-2 mt-2 transition duration-200 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <button
              type="submit"
              className="px-5 py-3 mt-6 hover:text-white font-bold transition-all  bg-blue-50  duration-300 border-2 text-blue-500 border-blue-500 rounded-lg shadow-md hover:bg-blue-600"
            >
              Submit Booking
            </button>
          </form>
        </div>
      );
    } else if (selectedService === "wheelchair") {
      return (
        <div className="flex justify-center w-full ">
          <form
            onSubmit={handleFormSubmit}
            className="mt-6 w-8/12 flex flex-col "
          >
            <h2 className="text-2xl font-bold text-blue-600 underline underline-offset-4 text-center">
              Wheelchair Booking
            </h2>
            <label className="block mt-4">Booking Date: </label>
            <DatePicker
              selected={formData.bookingDate}
              onChange={(date) =>
                setFormData({ ...formData, bookingDate: date })
              }
              minDate={minDate} // Setting minimum date to today
              className="w-full px-4 py-2 mt-2 transition duration-200 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />

            <label className="block mt-4">Booking Time:</label>
            <input
              type="time"
              value={formData.bookingTime || ""}
              onChange={(e) =>
                setFormData({ ...formData, bookingTime: e.target.value })
              }
              required
              className="w-full px-4 py-2 mt-2 transition duration-200 border border-teal-300 rounded-lg focus:ring-2 focus:ring-teal-400 outline-none"
            />

            <button
              type="submit"
              className="px-5 py-3 mt-6 hover:text-white font-bold transition-all bg-blue-50  duration-300 border-2 text-blue-500 border-blue-500 rounded-lg shadow-md hover:bg-blue-600"
            >
              Submit Booking
            </button>
          </form>
        </div>
      );
    }
  };

  return (
    <div
      className="max-w-5xl p-6 mx-auto bg-white rounded-lg shadow-lg  "
      style={{ marginTop: "3rem", marginBottom: "3rem" }}
    >
      <div className="flex flex-col items-center">
        <div className="flex w-full justify-between items-center  mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-800 transition-all duration-300 hover:text-white hover:bg-gray-800 border-2 border-gray-500 rounded-md px-2 py-1 shadow-sm text-sm"
          >
            <IoArrowBack className="mr-1" />
            Go Back
          </button>
          {buttonClicked ? (
            <button className="px-4 py-1 rounded-xl text-xs bg-blue-600 text-white  ">
              Scroll down for Filling the form
            </button>
          ) : (
            ""
          )}
        </div>

        <h1 className="mb-6 text-3xl font-bold text-blue-950">Booking Page</h1>

        <div className="mb-6 w-3/5">
          {" "}
          {/* Setting width to 60% */}
          <label className="block  text-blue-800 text-center mb-2 font-medium">
            Search for a Station
          </label>
          <input
            type="text"
            value={station}
            onChange={handleStationInputChange}
            placeholder="Type to search..."
            className="w-full px-4 py-3 transition duration-200 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {noResults && (
            <p className="mt-2 text-red-600 text-center">No results found.</p>
          )}
        </div>

        {stationSuggestions.length > 0 && (
          <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-md w-3/5">
            {stationSuggestions.map((suggestion) => (
              <li
                key={suggestion._id}
                onClick={() => handleStationSelect(suggestion)}
                className="p-3 transition duration-150 cursor-pointer hover:bg-gray-100"
              >
                {suggestion.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {loading && <p className="text-blue-600">Loading services...</p>}

      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex-1 p-4 mx-2 mb-4 transition duration-150 bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:shadow-md hover:shadow-blue-300 hover:-translate-y-1 hover:duration-500"
          >
            <div className="flex items-center justify-between ">
              <h3 className="text-lg text-blue-800 font-semibold">
                {service.name}
              </h3>
            </div>
            <div className="flex ">
              {service.availability > 0 ? (
                <span className="text-lg font-bold text-green-500">●</span>
              ) : (
                <span className="text-lg font-bold text-red-500">●</span>
              )}
              <p className="mt-1 ml-1">
                Available:{" "}
                <span className="font-semibold">{service.availability}</span>
              </p>
            </div>
            <div className="flex justify-center">
              <button
                onClick={() => handleBookNow(service.id)}
                className="px-6 py-2 mt-4 text-white transition-all  bg-blue-500 rounded-lg hover:bg-blue-600 hover:px-8 duration-300 text-sm"
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {renderBookingForm()}
    </div>
  );
};

export default BookingPage;

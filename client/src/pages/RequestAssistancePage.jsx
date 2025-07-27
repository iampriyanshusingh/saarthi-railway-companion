import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RequestAssistancePage = () => {
  const [assistanceType, setAssistanceType] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send this data to a backend API
    console.log({ assistanceType, description, contact });
    toast.success('Your assistance request has been submitted!');
    // Optionally clear form or navigate away
    setAssistanceType('');
    setDescription('');
    setContact('');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg dark:shadow-gray-800" style={{ marginTop: "3rem", marginBottom: "3rem" }}>
      <ToastContainer />
      <div className="flex w-full justify-start mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-800 dark:text-gray-200 transition-all duration-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 border-2 border-gray-500 dark:border-gray-700 rounded-md px-2 py-1 shadow-sm text-sm"
        >
          <IoArrowBack className="mr-1" />
          Go Back
        </button>
      </div>
      <h1 className="text-3xl font-bold text-center text-blue-950 dark:text-gray-100 mb-6">
        Request Assistance
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="assistanceType" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type of Assistance Needed:
          </label>
          <select
            id="assistanceType"
            value={assistanceType}
            onChange={(e) => setAssistanceType(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="">Select an option</option>
            <option value="medical">Medical Emergency</option>
            <option value="security">Security Issue</option>
            <option value="lost_property">Lost Property</option>
            <option value="mobility">Mobility Assistance (e.g., wheelchair)</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description:
          </label>
          <textarea
            id="description"
            rows="5"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
            placeholder="Please provide a brief description of the assistance you need..."
          ></textarea>
        </div>

        <div>
          <label htmlFor="contact" className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Contact Information (Optional, but recommended):
          </label>
          <input
            type="text"
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
            placeholder="e.g., Your phone number or email"
          />
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default RequestAssistancePage; 
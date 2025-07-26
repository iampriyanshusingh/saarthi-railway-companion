import mumbaiLocalTrains from "../Data/mumbaiLocalTrains";

const trainsdata = [
  // Intercity Trains (Existing)
  {
    id: "T101",
    name: "Express Voyager",
    number: "12345",
    status: "On Time",
    scheduledTime: "10:30 AM",
    actualTime: "10:30 AM",
    type: "arriving",
    currentLocation: "Kalyan",
    lateBy: "0 min",
    trainType: "Intercity", // Added trainType
    route: [
      {
        station: "Mumbai CST",
        arrivalTime: "08:00 AM",
        departureTime: "08:15 AM",
      },
      { station: "Thane", arrivalTime: "08:45 AM", departureTime: "08:47 AM" },
      { station: "Kalyan", arrivalTime: "09:05 AM", departureTime: "09:07 AM" },
      {
        station: "Nashik Road",
        arrivalTime: "10:30 AM",
        departureTime: "10:32 AM",
      },
      {
        station: "Bhusawal",
        arrivalTime: "12:00 PM",
        departureTime: "12:05 PM",
      },
      { station: "Nagpur", arrivalTime: "03:30 PM", departureTime: "03:45 PM" },
      { station: "Bhopal", arrivalTime: "07:00 PM", departureTime: "07:10 PM" },
      {
        station: "Agra Cantt",
        arrivalTime: "10:30 PM",
        departureTime: "10:35 PM",
      },
      { station: "New Delhi", arrivalTime: "01:00 AM", departureTime: "End" },
    ],
  },
  {
    id: "T102",
    name: "Coastal Runner",
    number: "67890",
    status: "Delayed by 15 min",
    scheduledTime: "11:00 AM",
    actualTime: "11:15 AM",
    type: "arriving",
    currentLocation: "Panvel",
    lateBy: "15 min",
    trainType: "Intercity", // Added trainType
    route: [
      {
        station: "Goa Madgaon",
        arrivalTime: "06:00 AM",
        departureTime: "06:15 AM",
      },
      {
        station: "Ratnagiri",
        arrivalTime: "08:30 AM",
        departureTime: "08:32 AM",
      },
      {
        station: "Chiplun",
        arrivalTime: "09:45 AM",
        departureTime: "09:47 AM",
      },
      { station: "Panvel", arrivalTime: "11:15 AM", departureTime: "11:20 AM" },
      { station: "Dadar", arrivalTime: "11:50 AM", departureTime: "11:55 AM" },
      {
        station: "Mumbai Central",
        arrivalTime: "12:15 PM",
        departureTime: "End",
      },
    ],
  },
  {
    id: "T103",
    name: "Desert Queen",
    number: "23456",
    status: "Departed",
    scheduledTime: "09:00 AM",
    actualTime: "09:00 AM",
    type: "departed",
    currentLocation: "Jodhpur",
    lateBy: "0 min",
    trainType: "Intercity", // Added trainType
    route: [
      { station: "Jaipur", arrivalTime: "07:00 AM", departureTime: "07:15 AM" },
      { station: "Ajmer", arrivalTime: "08:30 AM", departureTime: "08:35 AM" },
      {
        station: "Pali Marwar",
        arrivalTime: "09:00 AM",
        departureTime: "09:05 AM",
      },
      {
        station: "Jodhpur",
        arrivalTime: "10:30 AM",
        departureTime: "10:45 AM",
      },
      { station: "Barmer", arrivalTime: "01:00 PM", departureTime: "End" },
    ],
  },
  {
    id: "T104",
    name: "Mountain Mail",
    number: "98765",
    status: "On Time",
    scheduledTime: "12:00 PM",
    actualTime: "12:00 PM",
    type: "arriving",
    currentLocation: "Jalandhar City",
    lateBy: "0 min",
    trainType: "Intercity", // Added trainType
    route: [
      {
        station: "Dehradun",
        arrivalTime: "07:00 AM",
        departureTime: "07:15 AM",
      },
      {
        station: "Haridwar",
        arrivalTime: "08:00 AM",
        departureTime: "08:05 AM",
      },
      {
        station: "Roorkee",
        arrivalTime: "08:30 AM",
        departureTime: "08:32 AM",
      },
      {
        station: "Saharanpur",
        arrivalTime: "09:00 AM",
        departureTime: "09:05 AM",
      },
      {
        station: "Ambala Cantt",
        arrivalTime: "10:30 AM",
        departureTime: "10:35 AM",
      },
      {
        station: "Ludhiana",
        arrivalTime: "11:30 AM",
        departureTime: "11:35 AM",
      },
      {
        station: "Jalandhar City",
        arrivalTime: "12:00 PM",
        departureTime: "12:05 PM",
      },
      { station: "Amritsar", arrivalTime: "01:30 PM", departureTime: "End" },
    ],
  },
  {
    id: "T105",
    name: "Capital Connect",
    number: "54321",
    status: "Departed",
    scheduledTime: "10:15 AM",
    actualTime: "10:15 AM",
    type: "departed",
    currentLocation: "Agra Cantt",
    lateBy: "0 min",
    trainType: "Intercity", // Added trainType
    route: [
      {
        station: "New Delhi",
        arrivalTime: "07:00 AM",
        departureTime: "07:15 AM",
      },
      {
        station: "Ghaziabad",
        arrivalTime: "07:45 AM",
        departureTime: "07:47 AM",
      },
      {
        station: "Aligarh Jn",
        arrivalTime: "08:45 AM",
        departureTime: "08:47 AM",
      },
      {
        station: "Tundla Jn",
        arrivalTime: "09:15 AM",
        departureTime: "09:17 AM",
      },
      {
        station: "Agra Cantt",
        arrivalTime: "10:15 AM",
        departureTime: "10:20 AM",
      },
      {
        station: "Gwalior",
        arrivalTime: "11:30 AM",
        departureTime: "11:35 AM",
      },
      { station: "Jhansi Jn", arrivalTime: "01:00 PM", departureTime: "End" },
    ],
  },
  {
    id: "T106",
    name: "Deccan Queen",
    number: "12123",
    status: "On Time",
    scheduledTime: "05:10 PM",
    actualTime: "05:10 PM",
    type: "arriving",
    currentLocation: "Pune",
    lateBy: "0 min",
    trainType: "Intercity", // Added trainType
    route: [
      { station: "Pune", arrivalTime: "07:15 AM", departureTime: "07:20 AM" },
      {
        station: "Lonavala",
        arrivalTime: "08:00 AM",
        departureTime: "08:02 AM",
      },
      { station: "Kalyan", arrivalTime: "09:00 AM", departureTime: "09:03 AM" },
      { station: "Thane", arrivalTime: "09:20 AM", departureTime: "09:22 AM" },
      { station: "Mumbai CST", arrivalTime: "10:00 AM", departureTime: "End" },
    ],
  },
  {
    id: "T107",
    name: "Rajdhani Express",
    number: "12301",
    status: "Delayed by 30 min",
    scheduledTime: "04:00 PM",
    actualTime: "04:30 PM",
    type: "arriving",
    currentLocation: "Bhopal",
    lateBy: "30 min",
    trainType: "Intercity", // Added trainType
    route: [
      {
        station: "New Delhi",
        arrivalTime: "08:00 AM",
        departureTime: "08:30 AM",
      },
      {
        station: "Agra Cantt",
        arrivalTime: "10:30 AM",
        departureTime: "10:35 AM",
      },
      { station: "Bhopal", arrivalTime: "02:00 PM", departureTime: "02:10 PM" },
      { station: "Nagpur", arrivalTime: "07:00 PM", departureTime: "07:15 PM" },
      {
        station: "Secunderabad",
        arrivalTime: "11:30 PM",
        departureTime: "End",
      },
    ],
  },
  // Add all generated Mumbai Local trains
  ...mumbaiLocalTrains,
];

export default trainsdata;

import mumbaiLocalRoutes from "../Data/mumbaiLocalRoutes";
import generateDailyTrains from "../Data/generateDailyTrains";

const mumbaiLocalTrains = [
  // Central Line - CST to Karjat/Kasara
  ...generateDailyTrains(
    "MLC-S",
    "Central Local",
    "CSTK",
    "Slow",
    mumbaiLocalRoutes.centralMain,
    5,
    23,
    15,
    "Thane",
    "0 min"
  ),
  ...generateDailyTrains(
    "MLC-F",
    "Central Local",
    "CSTF",
    "Fast",
    mumbaiLocalRoutes.centralMain.filter((s) =>
      [
        "Mumbai CST",
        "Dadar",
        "Kurla",
        "Ghatkopar",
        "Thane",
        "Dombivli",
        "Kalyan",
        "Karjat",
      ].includes(s.station)
    ),
    6,
    22,
    30,
    "Kalyan",
    "0 min"
  ),
  ...generateDailyTrains(
    "MLC-AC",
    "Central AC Local",
    "CSTA",
    "AC",
    mumbaiLocalRoutes.centralMain.filter((s) =>
      ["Mumbai CST", "Dadar", "Kurla", "Thane", "Kalyan"].includes(s.station)
    ),
    8,
    20,
    60,
    "Kurla",
    "0 min"
  ),
  ...generateDailyTrains(
    "MLC-KAS",
    "Kasara Local",
    "KAS",
    "Slow",
    mumbaiLocalRoutes.centralKasara,
    7,
    21,
    45,
    "Asangaon",
    "10 min"
  ),

  // Harbour Line - CSMT to Panvel
  ...generateDailyTrains(
    "MLH-S",
    "Harbour Local",
    "HPS",
    "Slow",
    mumbaiLocalRoutes.harbourPanvel,
    5,
    23,
    15,
    "Vashi",
    "0 min"
  ),
  ...generateDailyTrains(
    "MLH-F",
    "Harbour Local",
    "HPF",
    "Fast",
    mumbaiLocalRoutes.harbourPanvel.filter((s) =>
      [
        "Mumbai CST",
        "Vadala Road",
        "Kurla",
        "Mankhurd",
        "Vashi",
        "Nerul",
        "Belapur CBD",
        "Panvel",
      ].includes(s.station)
    ),
    6,
    22,
    30,
    "Nerul",
    "0 min"
  ),
  // Harbour Line - CSMT to Goregaon
  ...generateDailyTrains(
    "MLH-G",
    "Goregaon Local",
    "HGS",
    "Slow",
    mumbaiLocalRoutes.harbourGoregaon,
    6,
    22,
    20,
    "Bandra",
    "5 min"
  ),

  // Western Line - Churchgate to Virar/Dahanu Road
  ...generateDailyTrains(
    "MLW-S",
    "Western Local",
    "WVS",
    "Slow",
    mumbaiLocalRoutes.westernVirar,
    5,
    23,
    10,
    "Borivali",
    "0 min"
  ),
  ...generateDailyTrains(
    "MLW-F",
    "Western Local",
    "WVF",
    "Fast",
    mumbaiLocalRoutes.westernVirar.filter((s) =>
      [
        "Churchgate",
        "Mumbai Central",
        "Dadar",
        "Bandra",
        "Andheri",
        "Borivali",
        "Bhayandar",
        "Vasai Road",
        "Virar",
      ].includes(s.station)
    ),
    6,
    22,
    20,
    "Andheri",
    "0 min"
  ),
  ...generateDailyTrains(
    "MLW-AC",
    "Western AC Local",
    "WVA",
    "AC",
    mumbaiLocalRoutes.westernVirar.filter((s) =>
      ["Churchgate", "Dadar", "Andheri", "Borivali", "Virar"].includes(
        s.station
      )
    ),
    8,
    20,
    45,
    "Dadar",
    "0 min"
  ),
  ...generateDailyTrains(
    "MLW-D",
    "Dahanu Road Local",
    "WDR",
    "Slow",
    mumbaiLocalRoutes.westernDahanu,
    7,
    21,
    60,
    "Palghar",
    "0 min"
  ),
];

export default mumbaiLocalTrains;

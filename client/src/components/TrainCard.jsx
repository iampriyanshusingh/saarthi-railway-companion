import LucidIcon from "../components/LucidIcon";
const TrainCard = ({ train, onClick }) => {
  return (
    <div
      className="bg-blue-50 p-4 md:p-6 rounded-xl shadow-md border border-blue-200 hover:border-blue-500 transition-all duration-300 cursor-pointer flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 md:space-x-4"
      onClick={() => onClick(train)}
    >
      <div className="flex items-center space-x-3 md:space-x-4">
        <LucidIcon
          name="Train"
          className="w-8 h-8 md:w-10 md:h-10 text-blue-600"
        />
        <div>
          <h4 className="text-xl md:text-2xl font-bold text-blue-900">
            {train.name}
          </h4>
          <p className="text-blue-700 text-sm md:text-base">
            Train No: {train.number}{" "}
            <span className="text-xs md:text-sm text-blue-500">
              ({train.trainType})
            </span>
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg md:text-xl font-semibold text-blue-900">
          Time: {train.scheduledTime}
        </p>
        <p
          className={`text-base md:text-lg font-medium ${
            train.status.includes("Delayed") ? "text-red-500" : "text-green-600"
          }`}
        >
          Status: {train.status}
        </p>
        {train.currentLocation && (
          <p className="text-xs md:text-sm text-purple-600 flex items-center justify-end mt-1">
            <LucidIcon
              name="MapPin"
              className="w-3 h-3 md:w-4 md:h-4 mr-1 text-purple-600"
            />{" "}
            Live: {train.currentLocation}
          </p>
        )}
        {train.lateBy && train.lateBy !== "0 min" && (
          <p className="text-xs md:text-sm text-red-500 mt-1">
            Late by: {train.lateBy}
          </p>
        )}
      </div>
    </div>
  );
};

export default TrainCard;

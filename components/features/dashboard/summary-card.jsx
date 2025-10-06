export const SummaryCard = ({
  icon,
  title,
  data,
  isPositive,
  percentValue,
  percent,
}) => {
  return (
    <div className="bg-white rounded-xl p-4 space-y-4">
      <div className="inline-flex bg-gray-100 rounded-xl p-3">{icon}</div>
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold">{data}</h3>
      <div>
        <p className="text-sm flex justify-between items-center">
          <span
            className={`rounded p-1 ${
              isPositive
                ? "text-green-600 bg-green-100"
                : "text-red-700 bg-red-100"
            }`}
          >
            {isPositive && percentValue > 0 ? "+" : ""}
            {percent}
          </span>
          In 7days
        </p>
      </div>
    </div>
  );
};

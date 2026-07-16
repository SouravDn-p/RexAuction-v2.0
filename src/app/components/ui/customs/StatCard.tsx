import Counter from "../../../../hooks/Counter";

export const StatCard = ({
  icon,
  title,
  value,
  color,
  isDarkMode,
}: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  color: string;
  isDarkMode: boolean;
}) => {
  const card = isDarkMode
    ? "bg-gray-800 border border-gray-700"
    : "bg-white border border-gray-100";

  const muted = isDarkMode ? "text-gray-400" : "text-gray-500";
  const strong = isDarkMode ? "text-white" : "text-gray-900";

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-all duration-300 ${card}`}
    >
      <div className="p-4 flex items-start justify-between">
        <div className="flex-1 min-w-0 pr-2">
          <p className={`text-xs font-medium mb-2 ${muted}`}>{title}</p>

          <p className={`text-2xl font-semibold tracking-tight ${strong}`}>
            {typeof value === "number" ? (
              <Counter end={value} />
            ) : (
              value
            )}
          </p>
        </div>

        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-r ${color} text-white`}
        >
          {icon}
        </div>
      </div>

      <div className={`h-1 bg-gradient-to-r ${color}`} />
    </div>
  );
};
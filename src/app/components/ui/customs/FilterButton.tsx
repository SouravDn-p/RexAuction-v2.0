interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  isDarkMode: boolean;
}

export const FilterButton = ({ label, isActive, onClick, isDarkMode }: FilterButtonProps) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? `${
            isDarkMode
              ? "bg-gray-700 text-white shadow-lg shadow-purple-500/10"
              : "bg-white text-purple-700 shadow-lg"
          }`
        : `${
            isDarkMode
              ? "text-gray-400 hover:text-white"
              : "text-gray-500 hover:text-purple-700"
          }`
    }`}
  >
    {label}
  </button>
);
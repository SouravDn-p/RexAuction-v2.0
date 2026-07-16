interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  isDarkMode?: boolean;
  disabled?: boolean;
  className?: string;
}

const ToggleSwitch = ({
  checked,
  onChange,
  isDarkMode = false,
  disabled = false,
  className = "",
}: ToggleSwitchProps) => {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`
        w-11 h-6 rounded-full relative transition-colors duration-200
        ${
          checked
            ? "bg-violet-600"
            : isDarkMode
            ? "bg-slate-600"
            : "bg-slate-300"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      <span
        className={`
          absolute right-6 top-0.5
          w-5 h-5 rounded-full bg-white
          transition-transform duration-200
          ${checked ? "translate-x-6" : "translate-x-0.5"}
        `}
      />
    </button>
  );
};

export default ToggleSwitch;
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useTheme } from "../../../../../hooks/useTheme";

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PasswordSettings() {
  const { isDarkMode } = useTheme();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const card   = `rounded-2xl border ${isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm"}`;
  const muted  = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const div    = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const inputCls = `w-full px-4 py-2.5 rounded-xl text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500 ${
    isDarkMode ? "bg-slate-700/50 border-slate-600 text-slate-100 placeholder-slate-500" : "bg-white border-slate-200 text-slate-800 placeholder-slate-400"
  }`;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>();

  const newPassword = watch("newPassword");

  const onSubmit = async (data: PasswordForm) => {
    const toastId = toast.loading("Updating password...");
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Password updated:", data);
    toast.success("Password updated successfully!", { id: toastId });
    reset();
  };

  const PasswordField = ({
    name,
    label,
    placeholder,
    show,
    toggleShow,
    validation,
    error,
  }: {
    name: string;
    label: string;
    placeholder: string;
    show: boolean;
    toggleShow: () => void;
    validation: Record<string, unknown>;
    error?: string;
  }) => (
    <div>
      <label className={`block text-xs font-medium mb-1.5 ${muted}`}>{label}</label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          {...register(name as keyof PasswordForm, validation as never)}
          className={inputCls}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={toggleShow}
          className={`absolute right-3 top-1/2 -translate-y-1/2 ${muted} hover:${strong} transition-colors`}
        >
          {show ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
        </button>
      </div>
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );

  return (
    <div className={card}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-6 py-4 border-b ${div}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-amber-500/10" : "bg-amber-50"}`}>
          <FaLock className="text-amber-500 w-3.5 h-3.5" />
        </div>
        <div>
          <h2 className={`text-sm font-semibold ${strong}`}>Change Password</h2>
          <p className={`text-xs ${muted}`}>Ensure your account security</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 max-w-lg">
        <PasswordField
          name="currentPassword"
          label="Current Password"
          placeholder="Enter current password"
          show={showCurrent}
          toggleShow={() => setShowCurrent(!showCurrent)}
          validation={{ required: "Current password is required" }}
          error={errors.currentPassword?.message}
        />

        <PasswordField
          name="newPassword"
          label="New Password"
          placeholder="Minimum 8 characters"
          show={showNew}
          toggleShow={() => setShowNew(!showNew)}
          validation={{
            required: "New password is required",
            minLength: { value: 8, message: "Must be at least 8 characters" },
            validate: {
              hasUpper: (v: string) => /[A-Z]/.test(v) || "Must contain an uppercase letter",
              hasNumber: (v: string) => /[0-9]/.test(v) || "Must contain a number",
            },
          }}
          error={errors.newPassword?.message}
        />

        <PasswordField
          name="confirmPassword"
          label="Confirm New Password"
          placeholder="Re-enter new password"
          show={showConfirm}
          toggleShow={() => setShowConfirm(!showConfirm)}
          validation={{
            required: "Please confirm your password",
            validate: (v: string) => v === newPassword || "Passwords do not match",
          }}
          error={errors.confirmPassword?.message}
        />

        {/* Password strength hint */}
        <div className={`p-3 rounded-xl text-xs ${isDarkMode ? "bg-slate-700/40 text-slate-400" : "bg-slate-50 text-slate-500"}`}>
          Password must be at least 8 characters with an uppercase letter and a number.
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <FaLock className="w-3.5 h-3.5" />
            )}
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}

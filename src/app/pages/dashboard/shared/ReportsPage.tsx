import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import {
  FiAlertTriangle,
  FiCheckCircle,
  FiFileText,
  FiFlag,
  FiPaperclip,
  FiUpload,
  FiUser
} from "react-icons/fi";
import { useTheme } from "../../../../hooks/useTheme";

const ReportsPage = () => {
  const { isDarkMode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const reportType = watch("reportAgainst");
  const selectedComplaint = watch("complaints");

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setUploadProgress(0);

    for (let i = 10; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 120));
      setUploadProgress(i);
    }

    setTimeout(() => {
      toast.success("Report submitted successfully. Our team will review it within 24–48 hours.", {
        duration: 5000,
        style: {
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          borderRadius: "10px",
          background: isDarkMode ? "#1e293b" : "#fff",
          color: isDarkMode ? "#f1f5f9" : "#0f172a",
          border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      });
      reset();
      setUploadedFiles([]);
      setIsSubmitting(false);
      setUploadProgress(0);
    }, 600);
  };

  const baseInput = `w-full px-4 py-3 rounded-xl border text-sm transition-all outline-none focus:ring-2 ${
    isDarkMode
      ? "bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500 focus:ring-indigo-500/40 focus:border-indigo-500"
      : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-indigo-500/20 focus:border-indigo-400"
  }`;

  const labelClass = `block text-xs font-semibold tracking-wide uppercase mb-2 ${
    isDarkMode ? "text-slate-400" : "text-slate-500"
  }`;

  const sectionCard = `rounded-2xl p-6 mb-6 ${
    isDarkMode ? "bg-slate-800/60 border border-slate-700/60" : "bg-white border border-slate-100 shadow-sm"
  }`;

  const sectionTitle = `text-sm font-semibold flex items-center gap-2 mb-5 ${
    isDarkMode ? "text-slate-200" : "text-slate-700"
  }`;

  const complaintOptions = [
    "Product was forgery",
    "Product was damaged",
    "Product not received",
    "Scammed with money",
    "Won the bid but couldn't claim",
    "Other",
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-slate-900 text-slate-100"
          : "bg-slate-50 text-slate-900"
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Toaster position="top-right" />

      {/* Page header */}
      <div
        className={`border-b px-6 py-5 ${
          isDarkMode ? "border-slate-700/50 bg-slate-900" : "border-slate-100 bg-white"
        }`}
      >
        <div className=" mx-auto flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isDarkMode ? "bg-rose-500/10" : "bg-rose-50"
            }`}
          >
            <FiFlag className="text-rose-500 w-4 h-4" />
          </div>
          <div>
            <h1
              className={`text-base font-semibold ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}
            >
              Report an Issue
            </h1>
            <p className={`text-xs mt-0.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              All reports are reviewed within 24–48 hours
            </p>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-6 py-8">
        {/* Progress bar */}
        {isSubmitting && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-4 ${
              isDarkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-medium ${isDarkMode ? "text-slate-300" : "text-slate-600"}`}>
                  Submitting report…
                </span>
                <span className={`text-xs font-semibold ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                  {uploadProgress}%
                </span>
              </div>
              <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}>
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Your Information */}
          <div className={sectionCard}>
            <h3 className={sectionTitle}>
              <FiUser className={`w-3.5 h-3.5 ${isDarkMode ? "text-indigo-400" : "text-indigo-500"}`} />
              Your information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Full name <span className="text-rose-500 normal-case tracking-normal">*</span>
                </label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  placeholder="Your full name"
                  className={`${baseInput} ${errors.name ? "border-rose-400 focus:ring-rose-400/30" : ""}`}
                />
                {errors.name && (
                  <p className="text-rose-500 text-xs mt-1.5">This field is required</p>
                )}
              </div>
              <div>
                <label className={labelClass}>
                  Email address <span className="text-rose-500 normal-case tracking-normal">*</span>
                </label>
                <input
                  {...register("email", {
                    required: true,
                    pattern: /\S+@\S+\.\S+/,
                  })}
                  type="email"
                  placeholder="you@email.com"
                  className={`${baseInput} ${errors.email ? "border-rose-400 focus:ring-rose-400/30" : ""}`}
                />
                {errors.email && (
                  <p className="text-rose-500 text-xs mt-1.5">
                    {errors.email.type === "pattern" ? "Invalid email address" : "This field is required"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Report Details */}
          <div className={sectionCard}>
            <h3 className={sectionTitle}>
              <FiAlertTriangle className={`w-3.5 h-3.5 ${isDarkMode ? "text-amber-400" : "text-amber-500"}`} />
              Report details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Reporting against <span className="text-rose-500 normal-case tracking-normal">*</span>
                </label>
                <select
                  {...register("reportAgainst", { required: true })}
                  className={`${baseInput} ${errors.reportAgainst ? "border-rose-400" : ""}`}
                >
                  <option value="">Select…</option>
                  <option value="Buyer">Buyer</option>
                  <option value="Seller">Seller</option>
                </select>
                {errors.reportAgainst && (
                  <p className="text-rose-500 text-xs mt-1.5">Please select an option</p>
                )}
              </div>
              <div>
                <label className={labelClass}>
                  {reportType
                    ? `${reportType}'s name`
                    : "Person's name"}{" "}
                  <span className="text-rose-500 normal-case tracking-normal">*</span>
                </label>
                <input
                  {...register("personReported", { required: true })}
                  type="text"
                  placeholder="Full name of reported person"
                  className={`${baseInput} ${errors.personReported ? "border-rose-400" : ""}`}
                />
                {errors.personReported && (
                  <p className="text-rose-500 text-xs mt-1.5">This field is required</p>
                )}
              </div>
            </div>
          </div>

          {/* Complaint Type */}
          <div className={sectionCard}>
            <h3 className={sectionTitle}>
              <FiFileText className={`w-3.5 h-3.5 ${isDarkMode ? "text-teal-400" : "text-teal-500"}`} />
              Complaint type <span className={`ml-1 text-rose-500 font-normal`}>*</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {complaintOptions.map((reason) => {
                const isSelected = selectedComplaint === reason;
                return (
                  <label
                    key={reason}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer border transition-all text-sm ${
                      isSelected
                        ? isDarkMode
                          ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                          : "border-indigo-400 bg-indigo-50/80 text-indigo-700"
                        : isDarkMode
                        ? "border-slate-700 hover:border-slate-500 text-slate-300"
                        : "border-slate-200 hover:border-slate-300 text-slate-600"
                    }`}
                  >
                    <input
                      type="radio"
                      value={reason}
                      {...register("complaints", { required: true })}
                      className="accent-indigo-500 w-4 h-4 shrink-0"
                    />
                    <span>{reason}</span>
                    {isSelected && (
                      <FiCheckCircle
                        className={`ml-auto shrink-0 w-4 h-4 ${
                          isDarkMode ? "text-indigo-400" : "text-indigo-500"
                        }`}
                      />
                    )}
                  </label>
                );
              })}
            </div>
            {errors.complaints && (
              <p className="text-rose-500 text-xs mt-3">Please select a complaint type</p>
            )}
          </div>

          {/* Evidence Upload */}
          <div className={sectionCard}>
            <h3 className={sectionTitle}>
              <FiPaperclip className={`w-3.5 h-3.5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`} />
              Supporting evidence <span className="text-rose-500 font-normal">*</span>
            </h3>

            <label
              htmlFor="proof-upload"
              className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-10 cursor-pointer transition-all ${
                isDarkMode
                  ? "border-slate-700 hover:border-indigo-500/60 hover:bg-indigo-500/5"
                  : "border-slate-200 hover:border-indigo-400/60 hover:bg-indigo-50/40"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isDarkMode ? "bg-slate-700" : "bg-slate-100"
                }`}
              >
                <FiUpload className={`w-4 h-4 ${isDarkMode ? "text-slate-300" : "text-slate-500"}`} />
              </div>
              <div className="text-center">
                <p className={`text-sm font-medium ${isDarkMode ? "text-slate-200" : "text-slate-700"}`}>
                  Drop files here or{" "}
                  <span className={`${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>browse</span>
                </p>
                <p className={`text-xs mt-1 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}>
                  Screenshots, documents · max 5 MB each
                </p>
              </div>
              <input
                type="file"
                multiple
                id="proof-upload"
                {...register("proofs", { required: true })}
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []).map((f) => f.name);
                  setUploadedFiles(files);
                }}
              />
            </label>

            {uploadedFiles.length > 0 && (
              <ul className="mt-3 space-y-1.5">
                {uploadedFiles.map((name, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${
                      isDarkMode ? "bg-slate-700/60 text-slate-300" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <FiPaperclip className="w-3 h-3 shrink-0 opacity-60" />
                    {name}
                  </li>
                ))}
              </ul>
            )}

            {errors.proofs && (
              <p className="text-rose-500 text-xs mt-2">Please upload at least one file</p>
            )}
          </div>

          {/* Notice */}
          <div
            className={`rounded-xl px-4 py-3 flex gap-3 text-xs leading-relaxed ${
              isDarkMode
                ? "bg-amber-500/10 border border-amber-500/20 text-amber-300"
                : "bg-amber-50 border border-amber-200 text-amber-700"
            }`}
          >
            <FiAlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              False reports may result in account suspension. Please ensure all information is accurate.
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all mt-2 ${
              isSubmitting
                ? isDarkMode
                  ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white shadow-md shadow-indigo-500/20"
            }`}
          >
            {isSubmitting ? "Submitting…" : "Submit report"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportsPage;
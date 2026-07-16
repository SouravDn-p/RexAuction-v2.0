import { Plus, Upload, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../../../hooks/useTheme";

const categories = [
  "Electronics", "Antiques", "Vehicles", "Furniture",
  "Jewelry", "Art", "Fashion", "Real Estate", "Collectibles", "Others"
];

const conditions = ["New", "Like New", "Excellent", "Good", "Fair", "Poor", "Restored"];

interface AuctionFormData {
  name: string;
  category: string;
  startingPrice: number;
  startTime: string;
  endTime: string;
  description: string;
  condition: string;
  itemYear?: number;
  history?: string;
  reference?: string;
}

export default function CreateAuction() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [minStartDate, setMinStartDate] = useState("");
  const [minEndDate, setMinEndDate] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<AuctionFormData>();

  const surface = isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";

  // Set minimum dates
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const minStart = `${year}-${month}-${day}T${hours}:${minutes}`;
    setMinStartDate(minStart);

    const startDateTime = new Date(minStart);
    startDateTime.setHours(startDateTime.getHours() + 1);
    const endYear = startDateTime.getFullYear();
    const endMonth = String(startDateTime.getMonth() + 1).padStart(2, '0');
    const endDay = String(startDateTime.getDate()).padStart(2, '0');
    const endHours = String(startDateTime.getHours()).padStart(2, '0');
    const endMinutes = String(startDateTime.getMinutes()).padStart(2, '0');
    setMinEndDate(`${endYear}-${endMonth}-${endDay}T${endHours}:${endMinutes}`);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);

    if (validFiles.length !== files.length) {
      toast.error("Some files exceed 5MB limit and were skipped");
    }

    setSelectedImages(prev => [...prev, ...validFiles].slice(0, 8));
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: AuctionFormData) => {
    if (selectedImages.length < 4) {
      toast.error("Please upload at least 4 images");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    // Simulate upload
    for (let i = 10; i <= 100; i += 15) {
      await new Promise(resolve => setTimeout(resolve, 180));
      setUploadProgress(i);
    }

    setTimeout(() => {
      toast.success("Auction Created Successfully!");

      reset();
      setSelectedImages([]);
      setUploadProgress(0);
      setIsSubmitting(false);

      setTimeout(() => {
        navigate("/seller/manageAuctions");
      }, 1500);
    }, 1200);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
        }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            borderRadius: "10px",
          },
        }}
      />

      {/* Header */}
      <div
        className={`border-b px-6 py-4 sticky top-0 z-30 backdrop-blur-sm ${isDarkMode
            ? "border-slate-700/50 bg-slate-900/80"
            : "border-slate-100 bg-white/80"
          }`}
      >
        <div className="mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-5xl">
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDarkMode ? "bg-violet-500/10" : "bg-violet-50"
                }`}
            >
              <Plus className="w-4 h-4 text-violet-500" />
            </div>
            <div>
              <h1 className={`text-sm font-semibold ${strong}`}>Create New Auction</h1>
              <p className={`text-xs ${muted}`}>List your item for bidding</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className={`rounded-2xl border p-8 ${surface}`}>
          {isSubmitting && (
            <div className="mb-8">
              <div className="flex justify-between mb-2 text-sm">
                <span className={muted}>Uploading images...</span>
                <span className={strong}>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${strong}`}>
                  Auction Title <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name", { required: "Title is required" })}
                  type="text"
                  placeholder="e.g. 1967 Shelby GT500 Eleanor"
                  className={`w-full px-5 py-3.5 rounded-2xl border focus:border-violet-500 outline-none transition-all ${isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                    }`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${strong}`}>
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  {...register("category", { required: "Category is required" })}
                  className={`w-full px-5 py-3.5 rounded-2xl border focus:border-violet-500 outline-none transition-all ${isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                    }`}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
              </div>
            </div>

            {/* Price & Timing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${strong}`}>
                  Starting Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("startingPrice", {
                    required: "Price is required",
                    min: { value: 0.01, message: "Price must be greater than 0" }
                  })}
                  type="number"
                  step="0.01"
                  placeholder="12500"
                  className={`w-full px-5 py-3.5 rounded-2xl border focus:border-violet-500 outline-none transition-all ${isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                    }`}
                />
                {errors.startingPrice && <p className="text-red-500 text-sm mt-1">{errors.startingPrice.message}</p>}
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${strong}`}>
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("startTime", { required: "Start time is required" })}
                  type="datetime-local"
                  min={minStartDate}
                  className={`w-full px-5 py-3.5 rounded-2xl border focus:border-violet-500 outline-none transition-all ${isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                    }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${strong}`}>
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("endTime", { required: "End time is required" })}
                  type="datetime-local"
                  min={minEndDate}
                  className={`w-full px-5 py-3.5 rounded-2xl border focus:border-violet-500 outline-none transition-all ${isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                    }`}
                />
              </div>
            </div>

            {/* Condition & Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${strong}`}>Condition</label>
                <select
                  {...register("condition")}
                  className={`w-full px-5 py-3.5 rounded-2xl border focus:border-violet-500 outline-none transition-all ${isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                    }`}
                >
                  <option value="">Select Condition</option>
                  {conditions.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${strong}`}>Item Year</label>
                <input
                  {...register("itemYear")}
                  type="number"
                  placeholder="1967"
                  className={`w-full px-5 py-3.5 rounded-2xl border focus:border-violet-500 outline-none transition-all ${isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-slate-200 text-slate-900"
                    }`}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${strong}`}>
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("description", { required: "Description is required" })}
                rows={6}
                placeholder="Provide detailed description of the item..."
                className={`w-full px-5 py-4 rounded-2xl border focus:border-violet-500 outline-none transition-all resize-y ${isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white"
                    : "bg-white border-slate-200 text-slate-900"
                  }`}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${strong}`}>
                Upload Images (Minimum 4 required) <span className="text-red-500">*</span>
              </label>

              <div
                className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all hover:border-violet-500 ${isDarkMode ? "border-slate-700" : "border-slate-300"
                  }`}
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                {selectedImages.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`preview-${index}`}
                          className="w-full aspect-square object-cover rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                          className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto text-5xl text-violet-500 mb-4" />
                    <p className="font-medium text-lg">Click or drag to upload images</p>
                    <p className={`text-sm mt-1 ${muted}`}>PNG, JPG • Max 5MB each • At least 4 images</p>
                  </div>
                )}
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {selectedImages.length > 0 && (
                <p className={`text-sm mt-3 text-center ${muted}`}>
                  {selectedImages.length} image(s) selected (max 8)
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || selectedImages.length < 4}
              className={`w-full py-4 rounded-2xl text-lg font-semibold transition-all ${isSubmitting || selectedImages.length < 4
                  ? "bg-slate-400 cursor-not-allowed text-white"
                  : "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/30"
                }`}
            >
              {isSubmitting ? "Creating Auction..." : "Create & Publish Auction"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
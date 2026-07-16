import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaCamera, FaSave } from "react-icons/fa";
import { MOCK_USER } from "../../../../../data/MOCK_USER";
import { useTheme } from "../../../../../hooks/useTheme";

interface ProfileForm {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
}

export default function ProfileSettings() {
  const { isDarkMode } = useTheme();

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
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({
    defaultValues: {
      name: MOCK_USER.name,
      email: MOCK_USER.email,
      phone: "+1 (555) 123-4567",
      location: MOCK_USER.location,
      bio: "Auction enthusiast and collector.",
    },
  });

  const onSubmit = async (data: ProfileForm) => {
    const toastId = toast.loading("Saving profile...");
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Profile saved:", data);
    toast.success("Profile updated successfully!", { id: toastId });
  };

  return (
    <div className={card}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-6 py-4 border-b ${div}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-violet-500/10" : "bg-violet-50"}`}>
          <FaCamera className="text-violet-500 w-3.5 h-3.5" />
        </div>
        <div>
          <h2 className={`text-sm font-semibold ${strong}`}>Profile Information</h2>
          <p className={`text-xs ${muted}`}>Update your personal details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={MOCK_USER.photoURL || "https://ui-avatars.com/api/?name=User&background=7c3aed&color=fff"}
              alt="Profile"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-violet-500/20"
            />
            <button
              type="button"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center transition-colors"
            >
              <FaCamera className="w-3 h-3" />
            </button>
          </div>
          <div>
            <p className={`text-sm font-medium ${strong}`}>{MOCK_USER.name}</p>
            <p className={`text-xs ${muted}`}>{MOCK_USER.email}</p>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Full Name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className={inputCls}
              placeholder="Your full name"
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Email</label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
              })}
              className={inputCls}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Phone</label>
            <input
              {...register("phone")}
              className={inputCls}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div>
            <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Location</label>
            <input
              {...register("location")}
              className={inputCls}
              placeholder="City, Country"
            />
          </div>
        </div>

        <div>
          <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Bio</label>
          <textarea
            {...register("bio")}
            rows={3}
            className={inputCls}
            placeholder="Tell us about yourself..."
          />
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
              <FaSave className="w-3.5 h-3.5" />
            )}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

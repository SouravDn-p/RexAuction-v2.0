import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaBell, FaSave } from "react-icons/fa";
import { useTheme } from "../../../../../hooks/useTheme";

interface NotificationForm {
  emailAuction: boolean;
  emailBid: boolean;
  emailPayment: boolean;
  emailMarketing: boolean;
  pushAuction: boolean;
  pushBid: boolean;
  pushPayment: boolean;
  smsCritical: boolean;
}

interface ToggleRowProps {
  label: string;
  description: string;
  control: any;
  name: keyof NotificationForm;
  isDarkMode: boolean;
}

function ToggleRow({ label, description, control, name, isDarkMode }: ToggleRowProps) {
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-200" : "text-slate-700";

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl ${isDarkMode ? "bg-slate-700/40" : "bg-slate-50"}`}>
      <div className="pr-4">
        <p className={`text-sm font-medium ${strong}`}>{label}</p>
        <p className={`text-xs mt-0.5 ${muted}`}>{description}</p>
      </div>
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <button
            type="button"
            onClick={() => onChange(!value)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 ${
              value ? "bg-violet-600" : isDarkMode ? "bg-slate-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                value ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        )}
      />
    </div>
  );
}

export default function NotificationSettings() {
  const { isDarkMode } = useTheme();

  const card   = `rounded-2xl border ${isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm"}`;
  const muted  = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const div    = isDarkMode ? "border-slate-700/60" : "border-slate-100";

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<NotificationForm>({
    defaultValues: {
      emailAuction: true,
      emailBid: true,
      emailPayment: true,
      emailMarketing: false,
      pushAuction: true,
      pushBid: true,
      pushPayment: false,
      smsCritical: false,
    },
  });

  const onSubmit = async (data: NotificationForm) => {
    const toastId = toast.loading("Saving preferences...");
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Notifications saved:", data);
    toast.success("Notification preferences saved!", { id: toastId });
  };

  return (
    <div className={card}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-6 py-4 border-b ${div}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-sky-500/10" : "bg-sky-50"}`}>
          <FaBell className="text-sky-500 w-3.5 h-3.5" />
        </div>
        <div>
          <h2 className={`text-sm font-semibold ${strong}`}>Notification Preferences</h2>
          <p className={`text-xs ${muted}`}>Choose what updates you receive</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Email Notifications */}
        <div>
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${muted}`}>Email Notifications</h3>
          <div className="space-y-2">
            <ToggleRow control={control} name="emailAuction" label="New Auctions" description="Get notified when new auctions match your interests" isDarkMode={isDarkMode} />
            <ToggleRow control={control} name="emailBid" label="Bid Updates" description="Receive updates when someone outbids you" isDarkMode={isDarkMode} />
            <ToggleRow control={control} name="emailPayment" label="Payment Receipts" description="Get confirmation emails for payments" isDarkMode={isDarkMode} />
            <ToggleRow control={control} name="emailMarketing" label="Marketing" description="Receive promotional emails and newsletters" isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Push Notifications */}
        <div>
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${muted}`}>Push Notifications</h3>
          <div className="space-y-2">
            <ToggleRow control={control} name="pushAuction" label="Auction Alerts" description="Ending soon and new listings" isDarkMode={isDarkMode} />
            <ToggleRow control={control} name="pushBid" label="Bid Activity" description="Real-time bid notifications" isDarkMode={isDarkMode} />
            <ToggleRow control={control} name="pushPayment" label="Payment Status" description="Payment success and failure alerts" isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* SMS */}
        <div>
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${muted}`}>SMS Notifications</h3>
          <div className="space-y-2">
            <ToggleRow control={control} name="smsCritical" label="Critical Alerts" description="Only for urgent account security issues" isDarkMode={isDarkMode} />
          </div>
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
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaCreditCard, FaSave } from "react-icons/fa";
import { useTheme } from "../../../../../hooks/useTheme";

interface BillingForm {
  cardHolder: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  billingAddress: string;
  city: string;
  zipCode: string;
  country: string;
}

export default function BillingSettings() {
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
  } = useForm<BillingForm>({
    defaultValues: {
      cardHolder: MOCK_USER_NAME,
      billingAddress: "123 Auction Street",
      city: "New York",
      zipCode: "10001",
      country: "United States",
    },
  });

  const onSubmit = async (data: BillingForm) => {
    const toastId = toast.loading("Saving billing info...");
    await new Promise((r) => setTimeout(r, 1000));
    console.log("Billing saved:", data);
    toast.success("Billing information updated!", { id: toastId });
  };

  return (
    <div className={card}>
      {/* Header */}
      <div className={`flex items-center gap-3 px-6 py-4 border-b ${div}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
          <FaCreditCard className="text-emerald-500 w-3.5 h-3.5" />
        </div>
        <div>
          <h2 className={`text-sm font-semibold ${strong}`}>Billing Information</h2>
          <p className={`text-xs ${muted}`}>Manage payment method and billing address</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        {/* Payment Method */}
        <div>
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${muted}`}>Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Card Holder Name</label>
              <input
                {...register("cardHolder", { required: "Card holder name is required" })}
                className={inputCls}
                placeholder="Name on card"
              />
              {errors.cardHolder && <p className="text-xs text-rose-500 mt-1">{errors.cardHolder.message}</p>}
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Card Number</label>
              <input
                {...register("cardNumber", {
                  required: "Card number is required",
                  pattern: { value: /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/, message: "Invalid card number" },
                })}
                className={inputCls}
                placeholder="1234 5678 9012 3456"
              />
              {errors.cardNumber && <p className="text-xs text-rose-500 mt-1">{errors.cardNumber.message}</p>}
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Expiry Date</label>
              <input
                {...register("expiry", {
                  required: "Expiry is required",
                  pattern: { value: /^(0[1-9]|1[0-2])\/\d{2}$/, message: "Use MM/YY format" },
                })}
                className={inputCls}
                placeholder="MM/YY"
              />
              {errors.expiry && <p className="text-xs text-rose-500 mt-1">{errors.expiry.message}</p>}
            </div>

            <div>
              <label className={`block text-xs font-medium mb-1.5 ${muted}`}>CVV</label>
              <input
                {...register("cvv", {
                  required: "CVV is required",
                  pattern: { value: /^\d{3,4}$/, message: "Invalid CVV" },
                })}
                className={inputCls}
                placeholder="123"
                maxLength={4}
              />
              {errors.cvv && <p className="text-xs text-rose-500 mt-1">{errors.cvv.message}</p>}
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div>
          <h3 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${muted}`}>Billing Address</h3>
          <div className="space-y-4">
            <div>
              <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Street Address</label>
              <input
                {...register("billingAddress", { required: "Address is required" })}
                className={inputCls}
                placeholder="123 Main Street"
              />
              {errors.billingAddress && <p className="text-xs text-rose-500 mt-1">{errors.billingAddress.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={`block text-xs font-medium mb-1.5 ${muted}`}>City</label>
                <input
                  {...register("city", { required: "City is required" })}
                  className={inputCls}
                  placeholder="City"
                />
                {errors.city && <p className="text-xs text-rose-500 mt-1">{errors.city.message}</p>}
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${muted}`}>ZIP Code</label>
                <input
                  {...register("zipCode", { required: "ZIP is required" })}
                  className={inputCls}
                  placeholder="10001"
                />
                {errors.zipCode && <p className="text-xs text-rose-500 mt-1">{errors.zipCode.message}</p>}
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${muted}`}>Country</label>
                <input
                  {...register("country", { required: "Country is required" })}
                  className={inputCls}
                  placeholder="United States"
                />
                {errors.country && <p className="text-xs text-rose-500 mt-1">{errors.country.message}</p>}
              </div>
            </div>
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
            {isSubmitting ? "Saving..." : "Save Billing Info"}
          </button>
        </div>
      </form>
    </div>
  );
}

const MOCK_USER_NAME = "Sourav Debnath";

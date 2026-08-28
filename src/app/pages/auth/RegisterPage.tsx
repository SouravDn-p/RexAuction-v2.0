import { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Camera, Eye, EyeOff, Loader2, Lock, Mail, User, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  MOCK_EMAIL_OTP,
  mockRegister,
  mockSendEmailOtp,
  mockVerifyEmailOtp,
  setErrorMessage,
  setLoading,
  setUser,
} from "../../redux/features/slices/authSlice";
import SocialLogin from "../../components/auth/SocialLogin";
import AuthShell, { glassCard, glassInput, glassLabel } from "../../components/auth/AuthShell";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const passwordCriteria = [
  { test: /[A-Z]/, message: "Uppercase" },
  { test: /[a-z]/, message: "Lowercase" },
  { test: /.{6,}/, message: "6+ characters" },
];

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, errorMessage } = useAppSelector((state) => state.auth);
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<"details" | "otp">("details");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpSending, setOtpSending] = useState(false);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setImageName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImagePreview(null);
    setImageName(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const passwordError =
    formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword;
  const failedRules = passwordCriteria.filter((c) => !c.test.test(formData.password));
  const detailsReady =
    formData.name.trim() &&
    formData.email.trim() &&
    !passwordError &&
    failedRules.length === 0 &&
    agreedTerms;

  const sendOtp = async () => {
    setOtpSending(true);
    try {
      await mockSendEmailOtp(formData.email);
      toast.success(`Verification code sent to ${formData.email}`);
      setStep("otp");
    } catch {
      toast.error("Could not send verification code");
    } finally {
      setOtpSending(false);
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!detailsReady) {
      toast.error("Please complete the form correctly");
      return;
    }
    await sendOtp();
  };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6).split("");
    const next = [...otp];
    pasted.forEach((d, i) => {
      next[i] = d;
    });
    setOtp(next);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const completeRegistration = async () => {
    const code = otp.join("");
    dispatch(setLoading(true));
    dispatch(setErrorMessage(null));
    try {
      await mockVerifyEmailOtp(code);
      const photoURL =
        imagePreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`;
      const userData = await mockRegister({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        photoURL,
      });
      dispatch(setUser(userData));
      toast.success("Registration successful! Welcome aboard!");
      navigate("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      dispatch(setErrorMessage(message));
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <AuthShell>
      <Toaster position="top-center" />

      <div className={`${glassCard} max-w-lg`}>
        {step === "details" ? (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
              <p className="text-sm text-white/55">Fill in your details, then verify your email</p>
            </div>

            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="flex flex-col items-center">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="relative group"
                  aria-label="Upload profile photo"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Selected profile"
                      className="w-24 h-24 rounded-full object-cover ring-2 ring-purple-400 ring-offset-2 ring-offset-transparent"
                    />
                  ) : (
                    <span className="w-24 h-24 rounded-full border border-dashed border-white/30 bg-white/5 flex items-center justify-center text-white/45 group-hover:border-purple-400 group-hover:text-purple-300 transition-colors">
                      <Camera className="w-7 h-7" />
                    </span>
                  )}
                  <span className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center border-2 border-black/30">
                    <Camera className="w-3.5 h-3.5" />
                  </span>
                </button>
                {imagePreview ? (
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-xs text-white/70 max-w-[180px] truncate">{imageName}</p>
                    <button
                      type="button"
                      onClick={clearImage}
                      className="text-white/50 hover:text-red-300"
                      aria-label="Remove photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-white/40 mt-2">Profile photo (optional)</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className={glassLabel}>Full name</span>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={glassInput}
                      required
                    />
                  </div>
                </label>
                <label className="block">
                  <span className={glassLabel}>Email</span>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@email.com"
                      className={glassInput}
                      required
                    />
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className={glassLabel}>Password</span>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create password"
                      className={`${glassInput} pr-11`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3.5 top-3.5 text-white/40 hover:text-white/80"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </label>
                <label className="block">
                  <span className={glassLabel}>Confirm</span>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat password"
                      className={`${glassInput} ${passwordError ? "border-red-400/70 focus:ring-red-400/30" : ""}`}
                      required
                    />
                  </div>
                </label>
              </div>
              {passwordError && <p className="text-sm text-red-300">Passwords do not match</p>}

              {formData.password && (
                <div className="flex flex-wrap gap-2">
                  {passwordCriteria.map((c) => {
                    const ok = c.test.test(formData.password);
                    return (
                      <span
                        key={c.message}
                        className={`text-[11px] rounded-full px-2.5 py-1 ${
                          ok ? "bg-emerald-400/15 text-emerald-300" : "bg-white/5 text-white/40"
                        }`}
                      >
                        {c.message}
                      </span>
                    );
                  })}
                </div>
              )}

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 rounded accent-purple-500 flex-shrink-0"
                  required
                />
                <span className="text-xs text-white/55 leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms-of-service" className="text-purple-300 hover:text-white">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="text-purple-300 hover:text-white">
                    Privacy Policy
                  </Link>
                  . See our{" "}
                  <Link to="/cookie-policy" className="text-purple-300 hover:text-white">
                    Cookie Policy
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={!detailsReady || otpSending}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 disabled:opacity-50"
              >
                {otpSending ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending code...
                  </span>
                ) : (
                  "Continue"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-white/55 mt-5">
              Already have an account?{" "}
              <NavLink to="/login" className="text-purple-300 font-medium hover:text-white">
                Sign in
              </NavLink>
            </p>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/15" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 text-white/40">or</span>
              </div>
            </div>
            <SocialLogin />
          </>
        ) : (
          <div className="space-y-5">
            <div className="text-center">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt={formData.name}
                  className="w-20 h-20 rounded-full object-cover ring-2 ring-purple-400 mx-auto mb-4"
                />
              )}
              <h1 className="text-2xl font-bold text-white mb-1">Check your email</h1>
              <p className="text-sm text-white/55">
                Code sent to <span className="text-white">{formData.email}</span>
              </p>
              <p className="text-sm text-purple-300 mt-2">
                Demo code: <span className="font-mono font-bold tracking-widest">{MOCK_EMAIL_OTP}</span>
              </p>
            </div>

            <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el;
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-11 h-12 text-center text-lg font-bold rounded-xl border border-white/20 bg-black/30 text-white outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400"
                />
              ))}
            </div>

            {errorMessage && (
              <p className="text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-2 text-center">
                {errorMessage}
              </p>
            )}

            <button
              type="button"
              onClick={completeRegistration}
              disabled={otp.join("").length !== 6 || isLoading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-500 disabled:opacity-50"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Creating account...
                </span>
              ) : (
                "Create account"
              )}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={() => setStep("details")} className="text-white/45 hover:text-white">
                Change email
              </button>
              <button
                type="button"
                onClick={sendOtp}
                disabled={otpSending}
                className="text-purple-300 font-medium"
              >
                {otpSending ? "Sending..." : "Resend code"}
              </button>
            </div>
          </div>
        )}
      </div>
    </AuthShell>
  );
};

export default RegisterPage;

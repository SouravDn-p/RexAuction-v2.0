import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { mockLogin, setErrorMessage, setLoading, setUser } from "../../redux/features/slices/authSlice";
import ForgotPasswordModal from "../../components/auth/ForgotPasswordModal";
import SocialLogin from "../../components/auth/SocialLogin";
import AuthShell, { glassCard, glassInput, glassLabel } from "../../components/auth/AuthShell";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, errorMessage } = useAppSelector((state) => state.auth);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleEmailPasswordLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(setLoading(true));
    dispatch(setErrorMessage(null));

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    try {
      const userData = await mockLogin(email, password);
      dispatch(setUser(userData));
      toast.success("Login successful! Welcome back.");
      navigate("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unable to sign in";
      dispatch(setErrorMessage(message));
      toast.error(message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <AuthShell>
      <Toaster position="top-center" />
      <ForgotPasswordModal showModal={showForgotPassword} setShowModal={setShowForgotPassword} />

      <div className={`${glassCard} max-w-md`}>
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-sm text-white/55">Sign in to your Rex Auction account</p>
        </div>

        <form onSubmit={handleEmailPasswordLogin} className="space-y-4">
          <label className="block">
            <span className={glassLabel}>Email</span>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
              <input
                type="email"
                className={glassInput}
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className={glassLabel}>Password</span>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-white/40" />
              <input
                type={showPassword ? "text" : "password"}
                className={`${glassInput} pr-11`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
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

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-white/60 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-purple-500"
              />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-purple-300 font-medium hover:text-white"
            >
              Forgot password?
            </button>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-200 bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-2">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-500 hover:to-violet-400 disabled:opacity-70"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-white/55 mt-5">
          Don&apos;t have an account?{" "}
          <NavLink to="/register" className="text-purple-300 font-medium hover:text-white">
            Sign up
          </NavLink>
        </p>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/15" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 text-white/40 bg-transparent">or</span>
          </div>
        </div>

        <SocialLogin />
      </div>
    </AuthShell>
  );
};

export default LoginPage;

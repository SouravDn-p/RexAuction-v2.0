import { useState } from "react";
import { Loader2, Mail, X } from "lucide-react";
import toast from "react-hot-toast";
import { mockPasswordReset } from "../../redux/features/slices/authSlice";
import { glassCard, glassInput, glassLabel } from "./AuthShell";

interface ForgotPasswordModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const ForgotPasswordModal = ({ showModal, setShowModal }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!showModal) return null;

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await mockPasswordReset(email);
      toast.success(`Password reset link sent to ${email}`);
      setShowModal(false);
      setEmail("");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
        aria-label="Close"
        onClick={() => setShowModal(false)}
      />
      <div className={`relative max-w-md ${glassCard}`}>
        <button
          type="button"
          onClick={() => setShowModal(false)}
          className="absolute right-5 top-5 text-white/40 hover:text-white"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-2xl font-bold text-white text-center">Forgot password</h3>
        <p className="text-center text-sm text-white/55 mt-2 mb-6">
          Enter your email and we&apos;ll send a reset link
        </p>

        <form onSubmit={handlePasswordReset} className="space-y-4">
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
                required
              />
            </div>
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-violet-500 disabled:opacity-70"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Sending...
              </span>
            ) : (
              "Send reset link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

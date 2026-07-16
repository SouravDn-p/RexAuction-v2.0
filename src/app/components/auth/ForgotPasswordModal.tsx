"use client";

import { useState } from "react";
import logo from "../../../assets/auth/google.png";
import { FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import { mockPasswordReset } from "../../redux/features/slices/authSlice";

interface ForgotPasswordModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ showModal, setShowModal }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await mockPasswordReset(email);
      toast.success(`Password reset link sent to ${email}`);
      setShowModal(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Modal backdrop */}
      <div className="modal modal-open">
        <div className="modal-box relative max-w-md backdrop-blur-lg bg-white/10 border border-white/20 shadow-xl text-white">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-48">
              <img
                src={logo}
                alt="rexAuction Logo"
                className="h-16 object-contain mx-auto"
              />
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={() => setShowModal(false)}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </button>

          {/* Header */}
          <h3 className="font-bold text-2xl text-center">
            Forgot Password
          </h3>
          <p className="text-center text-sm mt-2 opacity-70">
            Enter your email to receive a reset link
          </p>

          {/* Form */}
          <div className="mt-6">
            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="relative">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-4 w-4 text-blue-950" />
                  </div>
                  <input
                    type="email"
                    className="bg-white text-black w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${
                    isLoading ? "loading" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="modal-action justify-center mt-6">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn btn-ghost btn-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

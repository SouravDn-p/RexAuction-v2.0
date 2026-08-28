import { useNavigate } from "react-router-dom";
import google from "../../../assets/auth/google.png";
import { useAppDispatch } from "../../redux/hooks";
import { mockGoogleSignIn, setErrorMessage, setLoading, setUser } from "../../redux/features/slices/authSlice";
import toast from "react-hot-toast";

const SocialLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleGoogleLogin = async () => {
    dispatch(setLoading(true));
    dispatch(setErrorMessage(null));

    try {
      const userData = await mockGoogleSignIn();
      dispatch(setUser(userData));
      toast.success("Login successful with Google!");
      navigate("/");
    } catch {
      dispatch(setErrorMessage("Google login failed. Please try again."));
      toast.error("Google login failed. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="w-full py-3 flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 text-white font-medium hover:bg-white/15 transition-colors"
    >
      <img src={google} alt="" className="w-5 h-5" />
      Continue with Google
    </button>
  );
};

export default SocialLogin;

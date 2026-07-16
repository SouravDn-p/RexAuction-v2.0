import { useNavigate } from "react-router-dom";
import google from "../../../assets/auth/google.png";
import { useAppDispatch } from "../../redux/hooks";
import { setUser, setLoading, setErrorMessage, mockGoogleSignIn } from "../../redux/features/slices/authSlice";
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
    } catch (err: any) {
      console.error("Google login error:", err.message);
      dispatch(setErrorMessage(err.message));
      toast.error("Google login failed. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full py-3 flex items-center justify-center border-2 border-gray-500 text-purple-500 font-semibold rounded-lg shadow-md hover:bg-gradient-to-r from-blue-800 to-purple-900 hover:text-white transition-all"
      >
        <img src={google} alt="Google logo" className="w-8 h-8 mr-2" />
        Continue with Google
      </button>
    </div>
  );
};

export default SocialLogin;

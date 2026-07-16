import { useState } from "react";
import { useTheme } from "../../../../hooks/useTheme";

const mockUser = {
  email: "demo@rexauction.com",
  name: "Sourav Dev",
  photo: "https://i.pravatar.cc/150?img=12",
  role: "user",
};

const RateUsSection = () => {
  const { isDarkMode } = useTheme();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (!rating) return alert("Please select a rating.");

    const newFeedback = {
      userRating: rating,
      userFeedback: feedback,
      userEmail: mockUser.email,
      userName: mockUser.name,
      image: mockUser.photo,
      role: mockUser.role,
      date: new Date().toString(),
    };

    console.log("Submitted Feedback (STATIC):", newFeedback);

    // fake success feedback
    alert(`Thank you! You rated us ${rating} stars.`);

    setRating(0);
    setFeedback("");
  };

  return (
    <div
      className={`relative py-16 px-4 sm:px-6 overflow-hidden ${
        isDarkMode
          ? "bg-gray-950"
          : "bg-gradient-to-b from-purple-50 to-indigo-50"
      }`}
    >
      <div className="max-w-4xl mx-auto relative z-10">
        <div
          className={`text-center p-8 rounded-xl ${
            isDarkMode ? "bg-gray-800/90" : "bg-white/90"
          } shadow-xl transition-all duration-300 hover:shadow-2xl`}
        >
          <div className="mb-2">
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                isDarkMode
                  ? "bg-purple-900/50 text-purple-300"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              WE VALUE YOUR OPINION
            </span>
          </div>

          <h2
            className={`text-3xl md:text-4xl font-bold mb-3 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            How was your experience?
          </h2>

          <p
            className={`max-w-2xl mx-auto mb-6 text-lg ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Your feedback helps us improve RexAuction for everyone
          </p>

          {/* STAR RATING */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex bg-white/10 backdrop-blur-md p-2 rounded-full">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className={`mx-1 transition-all duration-200 transform ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-400 scale-125"
                      : isDarkMode
                      ? "text-gray-500"
                      : "text-gray-300"
                  }`}
                >
                  <span className="text-4xl">★</span>
                </button>
              ))}
            </div>
          </div>

          {/* FEEDBACK */}
          <div className="max-w-2xl mx-auto">
            <textarea
              rows={4}
              placeholder="Tell us more (optional)..."
              className={`w-full p-4 rounded-xl border-2 ${
                isDarkMode
                  ? "bg-gray-700/50 border-gray-600 text-white"
                  : "bg-white border-gray-200"
              } focus:outline-none resize-none`}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!rating}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  rating
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateUsSection;
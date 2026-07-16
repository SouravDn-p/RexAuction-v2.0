import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUpload } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { MOCK_USER } from "../../../../../data/MOCK_USER";
import { useTheme } from "../../../../../hooks/useTheme";

export default function CreateBlog() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const dbUser = MOCK_USER;

  const [loading, setLoading] = useState(false);
  const [blogData, setBlogData] = useState({
    title: "",
    imageFiles: [] as File[],
    fullContent: "",
  });

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      blogData.imageFiles.forEach((file) => {
        URL.revokeObjectURL(URL.createObjectURL(file));
      });
    };
  }, [blogData.imageFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "imageFiles" && files) {
      blogData.imageFiles.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
      setBlogData({ ...blogData, imageFiles: Array.from(files) });
    } else {
      setBlogData({ ...blogData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dbUser?.email || !dbUser?.name) {
      toast.error("You must be logged in to create a blog post");
      return;
    }

    if (!blogData.title.trim()) {
      toast.error("Please enter a blog title");
      return;
    }

    if (blogData.imageFiles.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    if (!blogData.fullContent.trim()) {
      toast.error("Please write the blog content");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Blog Posted Successfully!", {
        duration: 2500,
        position: "top-right",
      });

      // Reset form
      setBlogData({ title: "", imageFiles: [], fullContent: "" });
      setLoading(false);

      setTimeout(() => {
        navigate(`/${MOCK_USER.role}/blog`);
      }, 1800);
    }, 1600);
  };

  const handleReset = () => {
    blogData.imageFiles.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
    setBlogData({ title: "", imageFiles: [], fullContent: "" });
    toast.success("Form reset successfully");
  };

  const handleCancel = () => {
    blogData.imageFiles.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
    navigate(`/${MOCK_USER.role}/blog`);
  };

  const handleBack = () => {
    blogData.imageFiles.forEach((file) => URL.revokeObjectURL(URL.createObjectURL(file)));
    navigate(`/${MOCK_USER.role}/blog`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`min-h-screen p-4 md:p-6 lg:p-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-b from-purple-50 via-white to-white text-gray-800"
      }`}
    >
      <Toaster position="top-right" />

      <div className=" mx-auto">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-6 transition-all"
        >
          <FaArrowLeft className="text-lg" />
          <span className="font-medium">Back to Blogs</span>
        </button>

        <div
          className={`rounded-2xl shadow-xl border p-6 sm:p-8 md:p-10 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Create New Blog Post
            </h1>
            <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Share your thoughts with the community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title + Image Upload */}
            <div className="grid md:grid-cols-5 gap-6">
              <div className="md:col-span-3">
                <label className="block text-sm font-semibold mb-2">Blog Title</label>
                <input
                  type="text"
                  name="title"
                  value={blogData.title}
                  onChange={handleChange}
                  placeholder="Enter an engaging title..."
                  className={`w-full p-4 rounded-xl border focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-800"
                  }`}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">Upload Images</label>
                <div
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer hover:border-purple-500 transition-all ${
                    isDarkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-300 hover:bg-purple-50"
                  }`}
                  onClick={() => document.getElementById("imageUpload")?.click()}
                >
                  {blogData.imageFiles.length > 0 ? (
                    <div className="flex flex-wrap gap-3 justify-center">
                      {blogData.imageFiles.map((file, idx) => (
                        <img
                          key={idx}
                          src={URL.createObjectURL(file)}
                          alt="preview"
                          className="w-20 h-20 object-cover rounded-lg shadow-md"
                        />
                      ))}
                    </div>
                  ) : (
                    <div>
                      <FaUpload className={`mx-auto text-4xl mb-3 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`} />
                      <p className="text-sm font-medium">Click to upload images</p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG • Max 5MB each</p>
                    </div>
                  )}
                  <input
                    type="file"
                    id="imageUpload"
                    name="imageFiles"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Full Content */}
            <div>
              <label className="block text-sm font-semibold mb-2">Full Content</label>
              <textarea
                name="fullContent"
                value={blogData.fullContent}
                onChange={handleChange}
                placeholder="Write your blog content here..."
                rows={12}
                className={`w-full p-5 rounded-2xl border focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y transition-all ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleReset}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-gray-300"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all ${
                  isDarkMode
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-70"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-70"
                }`}
              >
                {loading ? "Publishing..." : "Publish Blog"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
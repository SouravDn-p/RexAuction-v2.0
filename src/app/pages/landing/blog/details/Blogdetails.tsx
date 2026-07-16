import  { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar,
  User,
  ArrowLeft,
  Bookmark,
  Share2,
  Clock,
  Tag,
  Mail,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
} from "react-icons/fa";
import { useTheme } from "../../../../../hooks/useTheme";
import { MOCK_BLOGS } from "../../../../../data/MOCK_BLOGS";

const BlogDetails = () => {
  const { isDarkMode } = useTheme();
  const { id } = useParams<{ id: string }>();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const blog = MOCK_BLOGS.find((b) => b._id === id) ?? null;

  if (!blog) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Blog Not Found</h2>
          <p className="mb-6">We couldn't find the blog you're looking for.</p>
          <Link
            to="/blogs"
            className={`px-6 py-3 rounded-full font-medium inline-flex items-center ${
              isDarkMode ? "bg-purple-600 hover:bg-purple-700" : "bg-purple-500 hover:bg-purple-600"
            } text-white`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  const readingTime = Math.ceil(blog.fullContent.split(/\s+/).length / 200);
  const images = blog.imageUrls ?? [];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.fullContent.substring(0, 100) + "...",
        url: window.location.href,
      }).catch(console.error);
    }
  };

  return (
    <div
      className={`min-h-screen pt-6 pb-14 px-4 md:px-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100"
          : ""
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link
          to="/blogs"
          className={`inline-flex items-center mb-6 px-4 mt-20 py-2 rounded-full transition-all ${
            isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-white hover:bg-gray-100"
          } shadow-sm`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blogs
        </Link>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600">
          {blog.title}
        </h1>

        {/* Meta */}
        <div className={`flex flex-wrap gap-4 mb-8 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>{blog.authorName}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>{readingTime} min read</span>
          </div>
          {blog.category && (
            <div className="flex items-center">
              <Tag className="w-4 h-4 mr-2" />
              <span className="capitalize">{blog.category}</span>
            </div>
          )}
        </div>

        {/* Image Gallery */}
        {images.length > 0 && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-xl">
            {/* Main Image */}
            <div className="relative h-[300px] md:h-[500px] w-full bg-black">
              <img
                src={images[activeImageIndex]}
                alt={`${blog.title} — image ${activeImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Prev / Next arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Dot indicators */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImageIndex(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          i === activeImageIndex ? "bg-white scale-125" : "bg-white/50"
                        }`}
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className={`flex gap-2 p-3 overflow-x-auto ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                {images.map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeImageIndex ? "border-purple-500 opacity-100" : "border-transparent opacity-60 hover:opacity-90"
                    }`}
                  >
                    <img src={url} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Full Content */}
        <div
          className={`p-6 md:p-8 rounded-2xl shadow-lg mb-10 transition-all duration-300 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="prose max-w-none dark:prose-invert prose-lg">
            <p className="whitespace-pre-line leading-relaxed">{blog.fullContent}</p>
          </div>
        </div>

        {/* Bookmark & Share */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-3 rounded-full ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? "text-purple-500 fill-purple-500" : ""}`} />
            </button>
            <button
              onClick={handleShare}
              className={`p-3 rounded-full ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
              aria-label="Share this blog"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm">Share:</span>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              <FaFacebookF className="w-4 h-4 text-blue-600" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              <X className="w-4 h-4 text-blue-400" />
            </a>
            <a
              href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              <FaLinkedinIn className="w-4 h-4 text-blue-700" />
            </a>
          </div>
        </div>

        {/* Author Bio */}
        {blog.authorBio && (
          <div className={`p-6 rounded-2xl shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className="text-xl font-bold mb-4">About the Author</h3>
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                {blog.authorImage ? (
                  <img src={blog.authorImage} alt={blog.authorName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-bold">{blog.authorName}</h4>
                {blog.authorEmail && (
                  <div className="flex items-center text-sm mb-2">
                    <Mail className="w-3 h-3 mr-2" />
                    <span>{blog.authorEmail}</span>
                  </div>
                )}
                <p className="text-sm">{blog.authorBio}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;
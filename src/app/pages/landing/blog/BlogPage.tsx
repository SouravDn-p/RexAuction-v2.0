import {  useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Calendar,
  User,
  ArrowRight,
  PenLine,
  Search,
  Clock,
  Filter,
  BookOpen,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../../../hooks/useTheme";
import { MOCK_BLOGS } from "../../../../data/MOCK_BLOGS";

const getReadingTime = (content: string): number => {
  if (!content) return 1;
  const wordCount = content.split(/\s+/).length;
  const time = Math.ceil(wordCount / 200);
  return time < 1 ? 1 : time;
};

const truncateContent = (content: string, maxLength = 120): string => {
  if (!content) return "";
  const plain = content.replace(/<[^>]+>/g, " ").trim();
  if (plain.length <= maxLength) return plain;
  return plain.substr(0, plain.lastIndexOf(" ", maxLength)) + "...";
};

const BlogPage = () => {
  const { isDarkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const blogsPerPage = 8;
  const navigate = useNavigate();

  const blogs = MOCK_BLOGS;
  const categories = ["All", ...Array.from(new Set(blogs.map((b) => b.category)))];

  const filteredBlogs = blogs
    .filter((blog) => {
      const matchesSearch =
        searchQuery === "" ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.fullContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div
      className={`min-h-screen p-4 md:p-8 transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100"
          : ""
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 pt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
              Discover Our Blogs
            </h1>
            <p className={`text-lg max-w-2xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              Explore insightful articles, tutorials, and stories from our community
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto mt-8 space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
              </div>
              <input
                type="text"
                placeholder="Search blogs by title, category, or author..."
                className={`w-full pl-10 pr-4 py-3 rounded-full border focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 focus:ring-purple-500 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 focus:ring-purple-400 text-gray-800 placeholder-gray-500"
                }`}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <div className="flex items-center gap-2">
                <Filter className={`w-4 h-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
                <select
                  value={selectedCategory}
                  onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-full border focus:outline-none focus:ring-2 ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 focus:ring-purple-500 text-white"
                      : "bg-white border-gray-300 focus:ring-purple-400 text-gray-800"
                  }`}
                >
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-full border focus:outline-none focus:ring-2 ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 focus:ring-purple-500 text-white"
                    : "bg-white border-gray-300 focus:ring-purple-400 text-gray-800"
                }`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Title A-Z</option>
              </select>

              <span className={`px-4 py-2 rounded-full ${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-purple-100 text-purple-700"}`}>
                {filteredBlogs.length} {filteredBlogs.length === 1 ? "Blog" : "Blogs"} Found
              </span>
            </div>
          </div>
        </div>

        {/* Empty State - No Blogs */}
        {blogs.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
            <div className="max-w-md mx-auto">
              <BookOpen className="mx-auto w-16 h-16 mb-4 text-purple-500" />
              <h2 className="text-2xl font-bold mb-3">No blogs available yet</h2>
              <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Be the first to create an amazing blog post!
              </p>
              <button
                onClick={() => navigate("/dashboard/blog")}
                className={`px-8 py-3 rounded-full font-medium flex items-center mx-auto space-x-2 transition-all transform hover:scale-105 ${
                  isDarkMode ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-500 hover:bg-purple-600 text-white"
                }`}
              >
                <PenLine className="w-4 h-4 mr-2" /> Create Your First Blog
              </button>
            </div>
          </motion.div>
        )}

        {/* No Search Results */}
        {blogs.length > 0 && filteredBlogs.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="max-w-md mx-auto">
              <Search className="mx-auto w-16 h-16 mb-4 text-purple-500" />
              <h2 className="text-2xl font-bold mb-3">No matching blogs found</h2>
              <p className={`mb-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Try adjusting your search or filters
              </p>
              <button
                onClick={handleClearFilters}
                className={`px-8 py-3 rounded-full font-medium transition-all transform hover:scale-105 ${
                  isDarkMode ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-500 hover:bg-purple-600 text-white"
                }`}
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}

        {/* Blog Grid */}
        {filteredBlogs.length > 0 && (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {currentBlogs.map((blog, index) => (
                <motion.div
                  key={blog._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                    isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"
                  }`}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={blog.imageUrls?.[0] || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500"}
                      alt={blog.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${isDarkMode ? "bg-purple-600/90 text-white" : "bg-purple-500/90 text-white"}`}>
                        {blog.category || "General"}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-lg flex items-center gap-1 ${isDarkMode ? "bg-gray-800/90 text-gray-200" : "bg-white/90 text-gray-700"}`}>
                        <Clock className="w-3 h-3" />
                        {getReadingTime(blog.fullContent)} min
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs mb-3 flex-wrap">
                      <span className={`flex items-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        <User className="w-3 h-3 mr-1" />
                        {blog.author || "Admin"}
                      </span>
                      <span className={`flex items-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-purple-500 transition-colors">
                      {blog.title}
                    </h3>

                    <p className={`text-sm mb-4 line-clamp-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                      {truncateContent(blog.fullContent)}
                    </p>

                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <Link
                        to={`/blogDetails/${blog._id}`}
                        className={`inline-flex items-center text-sm font-medium transition-colors group-hover:text-purple-500 ${
                          isDarkMode ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-800"
                        }`}
                      >
                        Continue Reading
                        <ArrowRight className="ml-2 w-3 h-3 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center mt-16 gap-2"
              >
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500"
                      : "bg-purple-100 text-purple-800 hover:bg-purple-200 disabled:bg-gray-200 disabled:text-gray-400"
                  }`}
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNumber = i + 1;
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-10 h-10 rounded-lg transition-all ${
                            currentPage === pageNumber
                              ? "bg-purple-600 text-white shadow-lg"
                              : isDarkMode
                              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      (pageNumber === currentPage - 2 && currentPage > 3) ||
                      (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span key={pageNumber} className={`w-10 h-10 flex items-center justify-center ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                    isDarkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500"
                      : "bg-purple-100 text-purple-800 hover:bg-purple-200 disabled:bg-gray-200 disabled:text-gray-400"
                  }`}
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage;

import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Clock,
  Edit,
  Eye,
  FileText,
  LayoutDashboard,
  Plus,
  Search,
  Star,
  Tags,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { MOCK_BLOGS } from "../../../../../data/MOCK_BLOGS";
import { MOCK_USER } from "../../../../../data/MOCK_USER";
import { useTheme } from "../../../../../hooks/useTheme";
import type { BlogType } from "../../../../../types/shared/blogTypes";

const safeFormatDate = (dateString: string, formatPattern: string): string => {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "—" : format(date, formatPattern);
  } catch {
    return "—";
  }
};

const spring = { type: "spring" as const, stiffness: 120, damping: 20 };

export default function DashboardBlogPage() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [blogPosts, setBlogPosts] = useState<BlogType[]>(MOCK_BLOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogType | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const surface = isDarkMode ? "bg-slate-800 border-slate-700/60" : "bg-white border-slate-100 shadow-sm";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";

  const deleteBlogPost = (id: string) => {
    toast(
      (t) => (
        <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="flex flex-col gap-3">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
            Delete this post?
          </p>
          <p className="text-xs text-slate-500">This action cannot be undone.</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setBlogPosts((prev) => prev.filter((p) => p._id !== id));
                if (selectedPost?._id === id) closePreviewModal();
                toast.dismiss(t.id);
                toast.success("Post deleted.");
              }}
              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs rounded-lg font-medium transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
  };

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.fullContent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openPreviewModal = (post: BlogType) => {
    setSelectedPost(post);
    setShowPreviewModal(true);
  };

  const closePreviewModal = () => {
    setShowPreviewModal(false);
    setSelectedPost(null);
  };

  const stats = [
    {
      label: "Total posts",
      value: blogPosts.length,
      icon: <LayoutDashboard className="w-4 h-4" />,
      color: isDarkMode ? "text-violet-400" : "text-violet-600",
      bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50",
    },
    {
      label: "Latest post",
      value: blogPosts.length > 0 ? blogPosts[0].title : "—",
      isText: true,
      icon: <Clock className="w-4 h-4" />,
      color: isDarkMode ? "text-sky-400" : "text-sky-600",
      bg: isDarkMode ? "bg-sky-500/10" : "bg-sky-50",
    },
    {
      label: "Last updated",
      value:
        blogPosts.length > 0 ? safeFormatDate(blogPosts[0].updatedAt, "MMM dd") : "Never",
      icon: <TrendingUp className="w-4 h-4" />,
      color: isDarkMode ? "text-emerald-400" : "text-emerald-600",
      bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50",
    },
    {
      label: "Featured",
      value: blogPosts.filter((p) => p.featured).length,
      icon: <Star className="w-4 h-4" />,
      color: isDarkMode ? "text-amber-400" : "text-amber-600",
      bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "13px",
            borderRadius: "10px",
          },
        }}
      />

      {/* Header */}
      <div
        className={`border-b px-6 py-4 sticky top-0 z-30 backdrop-blur-sm ${
          isDarkMode
            ? "border-slate-700/50 bg-slate-900/80"
            : "border-slate-100 bg-white/80"
        }`}
      >
        <div className=" mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isDarkMode ? "bg-violet-500/10" : "bg-violet-50"
              }`}
            >
              <BookOpen className="w-4 h-4 text-violet-500" />
            </div>
            <div>
              <h1 className={`text-sm font-semibold ${strong}`}>Blog Dashboard</h1>
              <p className={`text-xs ${muted}`}>Manage your content</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div
              className={`relative flex-1 sm:w-56 ${
                isDarkMode ? "text-slate-300" : "text-slate-600"
              }`}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
              <input
                type="text"
                placeholder="Search posts…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none transition-all ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500"
                    : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
                }`}
              />
            </div>

            <Link
              to={`/${MOCK_USER.role}/create-blog`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors shadow-md shadow-violet-500/20 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" />
              New post
            </Link>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, ...spring }}
              className={`rounded-2xl p-4 border ${surface}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-medium ${muted}`}>{stat.label}</span>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
              </div>
              <p
                className={`font-semibold ${
                  stat.isText ? "text-sm truncate" : "text-2xl"
                } ${strong}`}
              >
                {stat.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Blog grid */}
        {filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`rounded-2xl border p-16 text-center ${surface}`}
          >
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                isDarkMode ? "bg-slate-700" : "bg-slate-100"
              }`}
            >
              <FileText className={`w-6 h-6 ${muted}`} />
            </div>
            <h3 className={`text-base font-semibold mb-1 ${strong}`}>
              {searchTerm ? "No results found" : "No posts yet"}
            </h3>
            <p className={`text-sm mb-5 ${muted}`}>
              {searchTerm
                ? "Try a different search term"
                : "Create your first blog post to get started"}
            </p>
            <Link
              to={`/${MOCK_USER.role}/create-blog`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Create post
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post, i) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, ...spring }}
                className={`rounded-2xl border overflow-hidden group transition-all duration-200 hover:-translate-y-0.5 ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700/60 hover:border-slate-600"
                    : "bg-white border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200"
                }`}
              >
                {/* Thumbnail */}
                <div
                  className="relative h-44 overflow-hidden cursor-pointer"
                  onClick={() => openPreviewModal(post)}
                >
                  <img
                    src={
                      post.imageUrls[0] ||
                      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600"
                    }
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center ${
                      isDarkMode ? "bg-slate-900/50" : "bg-slate-800/30"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center">
                      <Eye className="w-4 h-4 text-slate-700" />
                    </div>
                  </div>
                  {post.featured && (
                    <span className="absolute top-2.5 left-2.5 flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-amber-400 text-amber-900">
                      <Star className="w-2.5 h-2.5" /> Featured
                    </span>
                  )}
                  <span
                    className={`absolute bottom-2.5 right-2.5 text-xs px-2 py-1 rounded-lg font-medium ${
                      isDarkMode
                        ? "bg-slate-900/70 text-slate-300"
                        : "bg-white/80 text-slate-600"
                    }`}
                  >
                    {safeFormatDate(post.createdAt, "MMM dd, yyyy")}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h2
                    className={`text-sm font-semibold mb-1.5 line-clamp-1 cursor-pointer hover:text-violet-500 transition-colors ${strong}`}
                    onClick={() => openPreviewModal(post)}
                  >
                    {post.title}
                  </h2>
                  <p
                    className={`text-xs line-clamp-2 leading-relaxed ${muted}`}
                    dangerouslySetInnerHTML={{
                      __html: post.fullContent.replace(/<[^>]+>/g, " ").trim(),
                    }}
                  />

                  <div
                    className={`flex items-center justify-between mt-4 pt-3.5 border-t ${
                      isDarkMode ? "border-slate-700/60" : "border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openPreviewModal(post)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          isDarkMode
                            ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                        }`}
                      >
                        <Eye className="w-3 h-3" /> Preview
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/updateBlog/${post._id}`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                    </div>
                    <button
                      onClick={() => deleteBlogPost(post._id)}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isDarkMode
                          ? "text-rose-400 hover:bg-rose-500/10"
                          : "text-rose-500 hover:bg-rose-50"
                      }`}
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: isDarkMode
                ? "rgba(2, 6, 23, 0.85)"
                : "rgba(15, 23, 42, 0.55)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
            onClick={closePreviewModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={spring}
              className={`relative w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-2xl ${
                isDarkMode
                  ? "bg-slate-800 border border-slate-700/60"
                  : "bg-white border border-slate-100 shadow-2xl shadow-slate-900/20"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div
                className={`sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700/60"
                    : "bg-white border-slate-100"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isDarkMode ? "bg-violet-500/10" : "bg-violet-50"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5 text-violet-500" />
                  </div>
                  <span className={`text-sm font-semibold ${strong}`}>Post preview</span>
                </div>
                <button
                  onClick={closePreviewModal}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isDarkMode ? "hover:bg-slate-700 text-slate-400" : "hover:bg-slate-100 text-slate-500"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-5">
                <div className="rounded-xl overflow-hidden h-52 mb-5">
                  <img
                    src={
                      selectedPost.imageUrls[0] ||
                      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"
                    }
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedPost.category && (
                    <span
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        isDarkMode
                          ? "bg-violet-500/10 text-violet-300"
                          : "bg-violet-50 text-violet-700"
                      }`}
                    >
                      <Tags className="w-3 h-3" />
                      {selectedPost.category}
                    </span>
                  )}
                  {selectedPost.featured && (
                    <span
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                        isDarkMode
                          ? "bg-amber-500/10 text-amber-300"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <Star className="w-3 h-3" /> Featured
                    </span>
                  )}
                  <span
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs ${
                      isDarkMode ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Calendar className="w-3 h-3" />
                    {safeFormatDate(selectedPost.createdAt, "MMM dd, yyyy")}
                  </span>
                </div>

                <h2 className={`text-base font-semibold mb-3 leading-snug ${strong}`}>
                  {selectedPost.title}
                </h2>

                <div
                  className={`prose prose-sm max-w-none text-sm leading-relaxed ${
                    isDarkMode ? "prose-invert text-slate-300" : "text-slate-600"
                  }`}
                  dangerouslySetInnerHTML={{ __html: selectedPost.fullContent }}
                />
              </div>

              {/* Modal footer */}
              <div
                className={`sticky bottom-0 flex items-center justify-between px-5 py-4 border-t ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700/60"
                    : "bg-white border-slate-100"
                }`}
              >
                <button
                  onClick={() => deleteBlogPost(selectedPost._id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isDarkMode
                      ? "text-rose-400 hover:bg-rose-500/10"
                      : "text-rose-500 hover:bg-rose-50"
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={closePreviewModal}
                    className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isDarkMode
                        ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    Close
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/updateBlog/${selectedPost._id}`)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit post
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
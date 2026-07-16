import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { FileDown, X, Pencil, Trash2, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useTheme } from "../../../../hooks/useTheme";
import { MOCK_AUCTIONS } from "../../../../data/MOCK_AUCTIONS";
import type { AuctionItem, AuctionStatus } from "../../../../types/shared/auctionTypes";
import { downloadAuctionPDF, isAuctionEnded } from "../../../lib/Downloadauctionpdf";

// ─── Edit form shape ──────────────────────────────────────────────────────────
interface EditFormData {
  name: string;
  description: string;
  category: string;
  startingPrice: string;
  condition: string;
  itemYear: string;
  startTime: string;
  endTime: string;
  status: string;
}

const toFormData = (a: AuctionItem): EditFormData => ({
  name: a.name ?? "",
  description: a.description ?? "",
  category: a.category ?? "",
  startingPrice: String(a.startingPrice ?? 0),
  condition: a.condition ?? "",
  itemYear: String(a.itemYear ?? new Date().getFullYear()),
  startTime: a.startTime ? a.startTime.slice(0, 16) : "",
  endTime: a.endTime ? a.endTime.slice(0, 16) : "",
  status: a.status ?? "pending",
});

// ─── Status badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ auction }: { auction: AuctionItem }) => {
  const ended = isAuctionEnded(auction);
  const s = ended ? "ended" : (auction.status ?? "pending").toLowerCase();

  const map: Record<string, string> = {
    ended:    "bg-slate-100 text-slate-600 border-slate-200",
    rejected: "bg-red-50 text-red-600 border-red-200",
    pending:  "bg-amber-50 text-amber-600 border-amber-200",
    accepted: "bg-emerald-50 text-emerald-600 border-emerald-200",
  };

  const label = ended ? "Ended" : (auction.status ?? "Pending");
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${map[s] ?? map.pending}`}>
      {label}
    </span>
  );
};

// ─── Labelled input ───────────────────────────────────────────────────────────
const Field = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required,
  isDarkMode,
  as = "input",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  required?: boolean;
  isDarkMode: boolean;
  as?: "input" | "textarea";
}) => {
  const base = `w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all ${
    isDarkMode
      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
  }`;

  return (
    <div className="space-y-1">
      <label className={`text-xs font-semibold uppercase tracking-wide ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {as === "textarea" ? (
        <textarea name={name} value={value} onChange={onChange} rows={3} className={base} />
      ) : (
        <input type={type} name={name} value={value} onChange={onChange} required={required} className={base} />
      )}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function ManageCard() {
  const { isDarkMode } = useTheme();

  const [auctions, setAuctions] = useState<AuctionItem[]>(MOCK_AUCTIONS);
  const [selectedAuction, setSelectedAuction] = useState<AuctionItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditFormData>(toFormData({} as AuctionItem));
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("All");
  const [isBusy, setIsBusy] = useState(false);
  const ITEMS_PER_PAGE = 6;

  // ── Derived ──
  const filtered = auctions.filter((a) => {
    if (filterStatus === "All") return true;
    if (filterStatus === "Ended") return isAuctionEnded(a);
    return (a.status ?? "").toLowerCase() === filterStatus.toLowerCase();
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // ── Handlers ──
  const openModal = (auction: AuctionItem) => {
    setSelectedAuction(auction);
    setEditForm(toFormData(auction));
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setSelectedAuction(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = (): boolean => {
    const { name, startingPrice, startTime, endTime } = editForm;
    if (!name.trim() || !startingPrice || !startTime || !endTime) {
      toast.error("Please fill in all required fields"); return false;
    }
    if (new Date(startTime) < new Date()) {
      toast.error("Start time cannot be in the past"); return false;
    }
    if (new Date(endTime) <= new Date(startTime)) {
      toast.error("End time must be after start time"); return false;
    }
    if (parseFloat(startingPrice) <= 0) {
      toast.error("Starting price must be greater than 0"); return false;
    }
    return true;
  };

  const handleEditSubmit = async () => {
    if (!selectedAuction || !validate()) return;
    const id = toast.loading("Updating auction…");
    setIsBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      const patch: Partial<AuctionItem> = {
        name: editForm.name,
        description: editForm.description,
        category: editForm.category,
        startingPrice: parseFloat(editForm.startingPrice),
        condition: editForm.condition,
        itemYear: parseInt(editForm.itemYear),
        startTime: new Date(editForm.startTime).toISOString(),
        endTime: new Date(editForm.endTime).toISOString(),
        status: editForm.status as AuctionStatus,
      };
      setAuctions((prev) => prev.map((a) => (a._id === selectedAuction._id ? { ...a, ...patch } : a)));
      setSelectedAuction((prev) => (prev ? { ...prev, ...patch } : null));
      toast.success("Auction updated!", { id });
      setIsEditing(false);
    } catch {
      toast.error("Update failed", { id });
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAuction) return;
    const confirmed = await new Promise<boolean>((resolve) => {
      toast(
        (t) => (
          <div className="flex flex-col gap-3 p-1">
            <p className="font-semibold text-sm">Delete this auction?</p>
            <p className="text-xs text-gray-500">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => { toast.dismiss(t.id); resolve(false); }}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-gray-100 hover:bg-gray-200 font-medium transition">
                Cancel
              </button>
              <button onClick={() => { toast.dismiss(t.id); resolve(true); }}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition">
                Delete
              </button>
            </div>
          </div>
        ),
        { duration: Infinity }
      );
    });

    if (!confirmed) return;
    const id = toast.loading("Deleting…");
    setIsBusy(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setAuctions((prev) => prev.filter((a) => a._id !== selectedAuction._id));
      toast.success("Deleted!", { id });
      closeModal();
    } catch {
      toast.error("Delete failed", { id });
    } finally {
      setIsBusy(false);
    }
  };

  // ── Styles ──
  const surface = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200";
  const text = isDarkMode ? "text-gray-100" : "text-gray-900";
  const subtext = isDarkMode ? "text-gray-400" : "text-gray-500";

  const FILTERS = ["All", "Accepted", "Rejected", "pending", "Ended"];

  return (
    <div className={`min-h-screen p-4 sm:p-6 transition-colors ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-slate-50 text-gray-900"}`}>
      <Toaster position="top-right" />

      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Auction Management</h1>
        <p className={`text-sm mt-1 ${subtext}`}>Review, edit, and track all your auction listings</p>
      </div>

      {/* ── Filter bar ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className={`flex items-center gap-1.5 text-xs font-medium mr-2 ${subtext}`}>
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              filterStatus === s
                ? "bg-violet-600 text-white border-violet-600 shadow-sm"
                : isDarkMode
                ? "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {s}
          </button>
        ))}
        <span className={`ml-auto text-xs flex items-center ${subtext}`}>
          {filtered.length} item{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ── */}
      <div className={`rounded-2xl border overflow-hidden shadow-sm ${surface}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`border-b text-xs font-semibold uppercase tracking-wide ${isDarkMode ? "border-gray-700 text-gray-400 bg-gray-800/60" : "border-gray-100 text-gray-500 bg-gray-50"}`}>
                {["Photo", "Item", "Start", "End", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left first:pl-5 last:pr-5">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className={`text-center py-16 ${subtext}`}>
                    No auctions found for <span className="font-medium">{filterStatus}</span>
                  </td>
                </tr>
              ) : (
                paginated.map((auction, i) => (
                  <motion.tr
                    key={auction._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className={`border-b last:border-0 transition-colors ${isDarkMode ? "border-gray-700 hover:bg-gray-750" : "border-gray-50 hover:bg-slate-50/80"}`}
                  >
                    <td className="px-4 py-3 pl-5">
                      <div className="w-14 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        <img
                          src={auction.images?.[0] ?? "/placeholder.svg"}
                          alt={auction.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium line-clamp-1 max-w-[160px]">{auction.name}</p>
                      <p className={`text-xs mt-0.5 ${subtext}`}>{auction.category}</p>
                    </td>
                    <td className={`px-4 py-3 text-xs ${subtext} whitespace-nowrap`}>
                      {auction.startTime ? new Date(auction.startTime).toLocaleDateString() : "—"}
                    </td>
                    <td className={`px-4 py-3 text-xs ${subtext} whitespace-nowrap`}>
                      {auction.endTime ? new Date(auction.endTime).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge auction={auction} />
                    </td>
                    <td className="px-4 py-3 pr-5 text-right">
                      <button
                        onClick={() => openModal(auction)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-violet-600 hover:bg-violet-700 text-white transition"
                      >
                        Details
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={`flex items-center justify-between px-5 py-3 border-t text-sm ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
            <span className={`text-xs ${subtext}`}>Page {currentPage} of {totalPages}</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`p-1.5 rounded-lg border transition disabled:opacity-40 ${isDarkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                    p === currentPage
                      ? "bg-violet-600 text-white"
                      : isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={`p-1.5 rounded-lg border transition disabled:opacity-40 ${isDarkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-50"}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Detail / Edit Modal ── */}
      <AnimatePresence>
        {isModalOpen && selectedAuction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", stiffness: 360, damping: 32 }}
              className={`relative w-full max-w-3xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col ${surface} ${text}`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
                <div>
                  <h2 className="font-bold text-base">
                    {isEditing ? "Edit Auction" : selectedAuction.name}
                  </h2>
                  {!isEditing && (
                    <p className={`text-xs mt-0.5 ${subtext}`}>{selectedAuction.category}</p>
                  )}
                </div>
                <button onClick={closeModal} className={`p-2 rounded-xl hover:bg-gray-100/10 transition ${subtext}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal body */}
              <div className="overflow-y-auto flex-1 px-6 py-5 space-y-6">
                {isEditing ? (
                  // ── Edit form ──
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Field label="Item Name" name="name" value={editForm.name} onChange={handleChange} required isDarkMode={isDarkMode} />
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Description" name="description" value={editForm.description} onChange={handleChange} isDarkMode={isDarkMode} as="textarea" />
                    </div>
                    <Field label="Category" name="category" value={editForm.category} onChange={handleChange} required isDarkMode={isDarkMode} />
                    <Field label="Starting Price ($)" name="startingPrice" value={editForm.startingPrice} onChange={handleChange} type="number" required isDarkMode={isDarkMode} />
                    <Field label="Condition" name="condition" value={editForm.condition} onChange={handleChange} isDarkMode={isDarkMode} />
                    <Field label="Item Year" name="itemYear" value={editForm.itemYear} onChange={handleChange} type="number" isDarkMode={isDarkMode} />
                    <Field label="Start Time" name="startTime" value={editForm.startTime} onChange={handleChange} type="datetime-local" required isDarkMode={isDarkMode} />
                    <Field label="End Time" name="endTime" value={editForm.endTime} onChange={handleChange} type="datetime-local" required isDarkMode={isDarkMode} />
                  </div>
                ) : (
                  // ── Detail view ──
                  <>
                    {/* Images */}
                    {!!selectedAuction.images?.length && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {selectedAuction.images.map((src, i) => (
                          <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                            <img src={src} alt={`${selectedAuction.name} ${i + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Info grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className={`rounded-2xl p-4 space-y-2 ${isDarkMode ? "bg-gray-700/50" : "bg-slate-50"}`}>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">Auction Details</h3>
                        {[
                          ["Category", selectedAuction.category],
                          ["Starting Price", `$${selectedAuction.startingPrice ?? 0}`],
                          ["Condition", selectedAuction.condition],
                          ["Year", selectedAuction.itemYear?.toString()],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between text-sm">
                            <span className={subtext}>{k}</span>
                            <span className="font-medium">{v ?? "—"}</span>
                          </div>
                        ))}
                      </div>

                      <div className={`rounded-2xl p-4 space-y-2 ${isDarkMode ? "bg-gray-700/50" : "bg-slate-50"}`}>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">Timing & Status</h3>
                        {[
                          ["Start", selectedAuction.startTime ? new Date(selectedAuction.startTime).toLocaleString() : "—"],
                          ["End", selectedAuction.endTime ? new Date(selectedAuction.endTime).toLocaleString() : "—"],
                          ["Seller", selectedAuction.sellerDisplayName ?? "Anonymous"],
                          ["Email", selectedAuction.sellerEmail ?? "—"],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between text-sm">
                            <span className={subtext}>{k}</span>
                            <span className="font-medium text-right max-w-[55%] truncate">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${subtext}`}>Status:</span>
                      <StatusBadge auction={selectedAuction} />
                    </div>

                    {/* Description */}
                    {selectedAuction.description && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-2">Description</h3>
                        <p className={`text-sm leading-relaxed ${subtext}`}>{selectedAuction.description}</p>
                      </div>
                    )}

                    {/* History */}
                    {selectedAuction.history && (
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-2">History</h3>
                        <p className={`text-sm leading-relaxed ${subtext}`}>{selectedAuction.history}</p>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Modal footer */}
              <div className={`flex items-center justify-between gap-3 px-6 py-4 border-t flex-shrink-0 ${isDarkMode ? "border-gray-700 bg-gray-800/60" : "border-gray-100 bg-gray-50/60"}`}>
                {isEditing ? (
                  <>
                    <button onClick={() => setIsEditing(false)} disabled={isBusy}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition ${isDarkMode ? "border-gray-600 hover:bg-gray-700" : "border-gray-200 hover:bg-gray-100"}`}>
                      Cancel
                    </button>
                    <button onClick={handleEditSubmit} disabled={isBusy}
                      className="px-5 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white transition disabled:opacity-50">
                      {isBusy ? "Saving…" : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        disabled={isAuctionEnded(selectedAuction) || isBusy}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white transition disabled:opacity-40"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isBusy}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition disabled:opacity-40"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                    <button
                      onClick={() => downloadAuctionPDF(selectedAuction)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white transition shadow-sm"
                    >
                      <FileDown className="w-3.5 h-3.5" /> Download PDF
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
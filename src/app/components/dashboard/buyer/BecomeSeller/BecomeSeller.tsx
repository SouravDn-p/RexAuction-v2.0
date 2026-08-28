import { useState, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Store,
  Globe,
  Camera,
  Lock,
  Sparkles,
  RotateCcw,
  FileText,
  Phone,
  BadgeCheck,
  Percent,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../../../../hooks/useTheme";

// ─── Types ─────────────────────────────────────────────────────────────────

type AppStatus = "none" | "pending" | "approved" | "rejected";
type BusinessType = "individual" | "business";

interface ApplicationData {
  nidNumber: string;
  phone: string;
  phoneVerified: boolean;
  frontDoc: string | null;
  backDoc: string | null;
  businessType: BusinessType;
  businessName: string;
  businessLicense: string;
  categories: string[];
  message: string;
  submittedAt: string;
  rejectionReason?: string;
}

interface SellerProfile {
  storeName: string;
  bio: string;
  avatar: string | null;
  instagram: string;
  facebook: string;
  website: string;
}

const CATEGORY_OPTIONS = ["Electronics", "Collectibles", "Art", "Vehicles", "Instruments", "Fashion"];

const EMPTY_APPLICATION: ApplicationData = {
  nidNumber: "", phone: "", phoneVerified: false, frontDoc: null, backDoc: null,
  businessType: "individual", businessName: "", businessLicense: "", categories: [], message: "", submittedAt: "",
};

// ─── Component ─────────────────────────────────────────────────────────────

export default function BecomeSeller() {
  const { isDarkMode } = useTheme();

  const [tab, setTab] = useState<"application" | "profile">("application");
  const [status, setStatus] = useState<AppStatus>("none");
  const [formStep, setFormStep] = useState(1);
  const [form, setForm] = useState<ApplicationData>(EMPTY_APPLICATION);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [codeSent, setCodeSent] = useState(false);

  const [profile, setProfile] = useState<SellerProfile>({ storeName: "", bio: "", avatar: null, instagram: "", facebook: "", website: "" });

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const surface = isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-100";
  const muted = isDarkMode ? "text-slate-400" : "text-slate-500";
  const strong = isDarkMode ? "text-slate-100" : "text-slate-800";
  const divider = isDarkMode ? "border-slate-700/60" : "border-slate-100";
  const panel = isDarkMode ? "bg-slate-700/40" : "bg-slate-50";
  const inputCls = `w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-all ${
    isDarkMode ? "bg-slate-800 border-slate-700 placeholder-slate-500 focus:border-violet-500" : "bg-slate-50 border-slate-200 placeholder-slate-400 focus:border-violet-400"
  }`;

  // ── file handlers (mock preview via object URL) ─────────────────────────
  const handleFile = (file: File | undefined, field: "frontDoc" | "backDoc") => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setForm(prev => ({ ...prev, [field]: url }));
  };
  const handleAvatar = (file: File | undefined) => {
    if (!file) return;
    setProfile(prev => ({ ...prev, avatar: URL.createObjectURL(file) }));
  };

  const sendCode = () => {
    if (!form.phone.trim()) { toast.error("Enter a phone number first"); return; }
    setCodeSent(true);
    toast.success("Verification code sent (mock: use 1234)");
  };
  const verifyCode = () => {
    if (codeInput !== "1234") { toast.error("Incorrect code"); return; }
    setForm(prev => ({ ...prev, phoneVerified: true }));
    toast.success("Phone number verified");
  };

  const toggleCategory = (cat: string) => {
    setForm(prev => ({ ...prev, categories: prev.categories.includes(cat) ? prev.categories.filter(c => c !== cat) : [...prev.categories, cat] }));
  };

  const canProceedStep1 = form.nidNumber.trim() && form.frontDoc && form.backDoc && form.phoneVerified;
  const canProceedStep2 = (form.businessType === "individual" || form.businessName.trim()) && form.categories.length > 0;

  const submitApplication = () => {
    if (!agreedTerms) { toast.error("Please agree to the seller terms"); return; }
    setForm(prev => ({ ...prev, submittedAt: new Date().toISOString().slice(0, 10) }));
    setStatus("pending");
    toast.success("Application submitted for review");
  };

  const resubmitApplication = () => {
    setStatus("none");
    setFormStep(1);
    toast.success("You can now edit and resubmit your application");
  };

  // preview-only helpers to simulate an admin decision, so the UI states are easy to check
  const simulateApprove = () => { setStatus("approved"); toast.success("Application approved!"); };
  const simulateReject = () => {
    setForm(prev => ({ ...prev, rejectionReason: "The uploaded ID photo was blurry and the NID number could not be verified. Please resubmit with a clearer photo." }));
    setStatus("rejected");
    toast.error("Application rejected");
  };

  const saveProfile = () => {
    if (!profile.storeName.trim()) { toast.error("Store name is required"); return; }
    toast.success("Seller profile saved");
  };

  const steps = [
    { n: 1, label: "Identity" },
    { n: 2, label: "Business & categories" },
    { n: 3, label: "Review & submit" },
  ];

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "bg-slate-900 text-slate-100" : "bg-slate-50 text-slate-900"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "'DM Sans', sans-serif", fontSize: "13px", borderRadius: "10px", background: isDarkMode ? "#1e293b" : "#fff", color: isDarkMode ? "#f1f5f9" : "#0f172a", border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0" } }} />

      {/* Header */}
      <div className={`sticky top-0 z-20 border-b backdrop-blur-xl ${isDarkMode ? "bg-slate-900/80 border-slate-700/50" : "bg-white/80 border-slate-100"}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isDarkMode ? "bg-violet-500/10" : "bg-violet-50"}`}>
                <Store className="w-4 h-4 text-violet-500" />
              </div>
              <div>
                <h1 className="text-sm font-semibold">Become a Seller</h1>
                <p className={`text-xs ${muted}`}>Apply once — list auctions after approval</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setTab("application")}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${tab === "application" ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"}`}
              >
                Application
              </button>
              <button
                onClick={() => status === "approved" ? setTab("profile") : toast.error("Available after your seller application is approved")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${tab === "profile" ? "bg-violet-600 text-white" : isDarkMode ? "text-slate-400 hover:bg-slate-800" : "text-slate-500 hover:bg-slate-100"} ${status !== "approved" ? "opacity-60" : ""}`}
              >
                {status !== "approved" && <Lock className="w-3.5 h-3.5" />} Storefront
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-3xl mx-auto">

        {/* ── Application tab ─────────────────────────────────────────── */}
        {tab === "application" && (
          <>
            {status === "none" && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {[
                    { label: "Seller commission", value: "5%", sub: "On successful sales", icon: <Percent className="w-4 h-4" />, color: "text-violet-400", bg: isDarkMode ? "bg-violet-500/10" : "bg-violet-50" },
                    { label: "Review time", value: "2–3 days", sub: "Typical decision window", icon: <Timer className="w-4 h-4" />, color: "text-amber-400", bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50" },
                    { label: "Identity check", value: "Required", sub: "NID + phone verification", icon: <BadgeCheck className="w-4 h-4" />, color: "text-emerald-400", bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50" },
                  ].map((s) => (
                    <div key={s.label} className={`rounded-2xl border p-4 ${surface}`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${s.bg} ${s.color}`}>{s.icon}</div>
                      <p className={`text-xs font-medium mb-0.5 ${muted}`}>{s.label}</p>
                      <p className={`text-lg font-bold ${strong}`}>{s.value}</p>
                      <p className={`text-[11px] mt-0.5 ${muted}`}>{s.sub}</p>
                    </div>
                  ))}
                </div>

                <div className={`rounded-2xl border p-5 mb-6 ${surface}`}>
                  <p className={`text-sm font-semibold mb-1 ${strong}`}>How selling works</p>
                  <p className={`text-xs leading-relaxed mb-4 ${muted}`}>
                    Complete identity verification, tell us what you plan to list, then wait for a short review. Once approved you can set up a storefront and create auctions. Listings stay live until they receive bids; withdrawing after bids land may be restricted.
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    {["Verify ID", "Get approved", "List & sell"].map((label, i) => (
                      <div key={label} className={`rounded-xl px-2 py-3 ${panel}`}>
                        <p className="text-xs font-bold text-violet-500 mb-0.5">0{i + 1}</p>
                        <p className={`text-[11px] font-medium ${strong}`}>{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

              <div className={`rounded-2xl border p-6 sm:p-8 ${surface}`}>
                {/* Stepper */}
                <div className="flex items-center mb-8">
                  {steps.map((s, i) => (
                    <div key={s.n} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${formStep >= s.n ? "bg-violet-600 text-white" : isDarkMode ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-400"}`}>
                          {formStep > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
                        </div>
                        <span className={`text-[11px] font-medium whitespace-nowrap ${formStep >= s.n ? strong : muted}`}>{s.label}</span>
                      </div>
                      {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${formStep > s.n ? "bg-violet-600" : isDarkMode ? "bg-slate-700" : "bg-slate-200"}`} />}
                    </div>
                  ))}
                </div>

                {/* Step 1 */}
                {formStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className={`text-xs font-medium mb-1.5 block ${strong}`}>NID number</label>
                      <input value={form.nidNumber} onChange={e => setForm({ ...form, nidNumber: e.target.value })} placeholder="National ID number" className={inputCls} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Front of ID</label>
                        <button onClick={() => frontInputRef.current?.click()} className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 overflow-hidden ${isDarkMode ? "border-slate-600 hover:border-violet-500" : "border-slate-300 hover:border-violet-400"}`}>
                          {form.frontDoc ? <img src={form.frontDoc} className="w-full h-full object-cover" /> : <><Upload className="w-5 h-5 opacity-50" /><span className={`text-xs ${muted}`}>Upload</span></>}
                        </button>
                        <input ref={frontInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0], "frontDoc")} />
                      </div>
                      <div>
                        <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Back of ID</label>
                        <button onClick={() => backInputRef.current?.click()} className={`w-full aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 overflow-hidden ${isDarkMode ? "border-slate-600 hover:border-violet-500" : "border-slate-300 hover:border-violet-400"}`}>
                          {form.backDoc ? <img src={form.backDoc} className="w-full h-full object-cover" /> : <><Upload className="w-5 h-5 opacity-50" /><span className={`text-xs ${muted}`}>Upload</span></>}
                        </button>
                        <input ref={backInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleFile(e.target.files?.[0], "backDoc")} />
                      </div>
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Phone number</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" />
                          <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+880 1XXX-XXXXXX" disabled={form.phoneVerified} className={`${inputCls} pl-9`} />
                        </div>
                        {!form.phoneVerified && (
                          <button onClick={sendCode} className={`px-3.5 py-2.5 rounded-xl text-xs font-medium border shrink-0 ${isDarkMode ? "border-slate-600 text-slate-300" : "border-slate-200 text-slate-600"}`}>{codeSent ? "Resend" : "Send code"}</button>
                        )}
                      </div>
                      {codeSent && !form.phoneVerified && (
                        <div className="flex gap-2 mt-2">
                          <input value={codeInput} onChange={e => setCodeInput(e.target.value)} placeholder="Enter 4-digit code" className={inputCls} />
                          <button onClick={verifyCode} className="px-3.5 py-2.5 rounded-xl text-xs font-medium bg-violet-600 hover:bg-violet-700 text-white shrink-0">Verify</button>
                        </div>
                      )}
                      {form.phoneVerified && <p className="text-xs text-emerald-500 flex items-center gap-1 mt-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Phone verified</p>}
                    </div>
                  </div>
                )}

                {/* Step 2 */}
                {formStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Seller type</label>
                      <div className="flex gap-2">
                        <button onClick={() => setForm({ ...form, businessType: "individual" })} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${form.businessType === "individual" ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>Individual seller</button>
                        <button onClick={() => setForm({ ...form, businessType: "business" })} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${form.businessType === "business" ? "bg-violet-500/15 text-violet-400 border-violet-500/30" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>Registered business</button>
                      </div>
                    </div>
                    {form.businessType === "business" && (
                      <>
                        <div>
                          <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Business name</label>
                          <input value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} placeholder="Your business name" className={inputCls} />
                        </div>
                        <div>
                          <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Business license number (optional)</label>
                          <input value={form.businessLicense} onChange={e => setForm({ ...form, businessLicense: e.target.value })} placeholder="TRAD-XXXX-XXXXX" className={inputCls} />
                        </div>
                      </>
                    )}
                    <div>
                      <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Category interests</label>
                      <div className="flex flex-wrap gap-2">
                        {CATEGORY_OPTIONS.map(cat => (
                          <button key={cat} onClick={() => toggleCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.categories.includes(cat) ? "bg-violet-600 text-white border-violet-600" : isDarkMode ? "border-slate-600 text-slate-400" : "border-slate-200 text-slate-500"}`}>{cat}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Tell us about what you'll sell</label>
                      <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={3} placeholder="A short note about your experience or the items you plan to list..." className={inputCls} />
                    </div>
                  </div>
                )}

                {/* Step 3 */}
                {formStep === 3 && (
                  <div className="space-y-4">
                    <div className={`rounded-xl p-4 space-y-2.5 text-sm ${panel}`}>
                      <div className="flex justify-between"><span className={muted}>NID number</span><span className={strong}>{form.nidNumber || "—"}</span></div>
                      <div className="flex justify-between"><span className={muted}>Phone</span><span className={strong}>{form.phone} {form.phoneVerified && "✓"}</span></div>
                      <div className="flex justify-between"><span className={muted}>Seller type</span><span className={strong}>{form.businessType === "individual" ? "Individual" : form.businessName || "Business"}</span></div>
                      <div className="flex justify-between"><span className={muted}>Categories</span><span className={`${strong} text-right`}>{form.categories.join(", ") || "—"}</span></div>
                    </div>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={agreedTerms} onChange={e => setAgreedTerms(e.target.checked)} className="mt-0.5" />
                      <span className={`text-xs ${muted}`}>
                        I agree to Rex Auction&apos;s{" "}
                        <Link to="/terms" className="text-purple-400 hover:underline">
                          seller terms
                        </Link>
                        ,{" "}
                        <Link to="/terms-of-service" className="text-purple-400 hover:underline">
                          Terms of Service
                        </Link>
                        , and{" "}
                        <Link to="/privacy-policy" className="text-purple-400 hover:underline">
                          Privacy Policy
                        </Link>
                        , and confirm the information above is accurate.
                      </span>
                    </label>
                  </div>
                )}

                {/* Nav buttons */}
                <div className={`flex items-center justify-between mt-8 pt-5 border-t ${divider}`}>
                  {formStep > 1 ? (
                    <button onClick={() => setFormStep(s => s - 1)} className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium ${isDarkMode ? "bg-slate-700 text-slate-300" : "bg-slate-100 text-slate-600"}`}><ArrowLeft className="w-4 h-4" /> Back</button>
                  ) : <span />}
                  {formStep < 3 ? (
                    <button
                      onClick={() => {
                        if (formStep === 1 && !canProceedStep1) { toast.error("Complete ID verification to continue"); return; }
                        if (formStep === 2 && !canProceedStep2) { toast.error("Add at least one category to continue"); return; }
                        setFormStep(s => s + 1);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white"
                    >Next <ArrowRight className="w-4 h-4" /></button>
                  ) : (
                    <button onClick={submitApplication} className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white">Submit application</button>
                  )}
                </div>
              </div>
              </>
            )}

            {status !== "none" && (
              <div className="space-y-5">
                {/* Timeline */}
                <div className={`rounded-2xl border p-6 ${surface}`}>
                  <div className="flex items-center">
                    {["Submitted", "Under Review", "Decision"].map((label, i) => {
                      const stageIndex = status === "pending" ? 1 : 2;
                      const done = i < stageIndex;
                      const current = i === stageIndex;
                      return (
                        <div key={label} className="flex items-center flex-1 last:flex-none">
                          <div className="flex flex-col items-center gap-1.5">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${done ? "bg-emerald-500 text-white" : current ? (status === "rejected" ? "bg-rose-500 text-white" : "bg-amber-500 text-white") : isDarkMode ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-400"}`}>
                              {done ? <CheckCircle2 className="w-4 h-4" /> : current ? (status === "rejected" ? <XCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />) : <span className="text-xs">{i + 1}</span>}
                            </div>
                            <span className={`text-[11px] font-medium whitespace-nowrap ${done || current ? strong : muted}`}>{label}</span>
                          </div>
                          {i < 2 && <div className={`flex-1 h-0.5 mx-2 ${i < stageIndex ? "bg-emerald-500" : isDarkMode ? "bg-slate-700" : "bg-slate-200"}`} />}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {status === "pending" && (
                  <div className={`rounded-2xl border p-6 space-y-4 ${surface}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? "bg-amber-500/10" : "bg-amber-50"}`}><Clock className="w-5 h-5 text-amber-500" /></div>
                      <div>
                        <p className={`text-sm font-semibold ${strong}`}>Application under review</p>
                        <p className={`text-xs ${muted}`}>Submitted {form.submittedAt} · We typically respond within 2–3 business days</p>
                      </div>
                    </div>
                    <div className={`rounded-xl p-4 border border-dashed text-xs space-y-2 ${isDarkMode ? "border-slate-600" : "border-slate-300"}`}>
                      <p className={`font-medium ${strong}`}>Preview only — simulate admin decision</p>
                      <div className="flex gap-2">
                        <button onClick={simulateApprove} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white">Simulate approve</button>
                        <button onClick={simulateReject} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-rose-600 hover:bg-rose-700 text-white">Simulate reject</button>
                      </div>
                    </div>
                  </div>
                )}

                {status === "rejected" && (
                  <div className={`rounded-2xl border p-6 space-y-4 ${surface}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? "bg-rose-500/10" : "bg-rose-50"}`}><XCircle className="w-5 h-5 text-rose-500" /></div>
                      <div><p className={`text-sm font-semibold ${strong}`}>Application rejected</p><p className={`text-xs ${muted}`}>You can address the feedback below and resubmit</p></div>
                    </div>
                    <div className={`rounded-xl p-4 text-sm ${isDarkMode ? "bg-rose-500/10" : "bg-rose-50"}`}>{form.rejectionReason}</div>
                    <button onClick={resubmitApplication} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white"><RotateCcw className="w-4 h-4" /> Resubmit application</button>
                  </div>
                )}

                {status === "approved" && (
                  <div className={`rounded-2xl border p-6 space-y-4 text-center ${surface}`}>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50"}`}><Sparkles className="w-7 h-7 text-emerald-500" /></div>
                    <div>
                      <p className={`text-base font-semibold ${strong}`}>You're approved to sell!</p>
                      <p className={`text-sm mt-1 ${muted}`}>Set up your storefront to start listing auctions.</p>
                    </div>
                    <button onClick={() => setTab("profile")} className="px-5 py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white">Set up seller profile</button>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* ── Profile tab ──────────────────────────────────────────────── */}
        {tab === "profile" && status === "approved" && (
          <div className={`rounded-2xl border p-6 sm:p-8 space-y-6 ${surface}`}>
            <div className="flex items-center gap-4">
              <button onClick={() => avatarInputRef.current?.click()} className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 group">
                {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" /> : <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? "bg-slate-700" : "bg-slate-100"}`}><Store className="w-6 h-6 opacity-40" /></div>}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera className="w-5 h-5 text-white" /></div>
              </button>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={e => handleAvatar(e.target.files?.[0])} />
              <div>
                <p className={`text-sm font-semibold ${strong}`}>Store avatar</p>
                <p className={`text-xs ${muted}`}>Square image recommended, at least 200×200px</p>
              </div>
            </div>

            <div>
              <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Store name</label>
              <input value={profile.storeName} onChange={e => setProfile({ ...profile, storeName: e.target.value })} placeholder="e.g. Vintage Finds Co." className={inputCls} />
            </div>
            <div>
              <label className={`text-xs font-medium mb-1.5 block ${strong}`}>Bio</label>
              <textarea value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} rows={3} placeholder="Tell buyers what makes your store special..." className={inputCls} />
            </div>

            <div className="grid grid-cols-1 gap-3">
              {/* <div className="relative"><Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" /><input value={profile.instagram} onChange={e => setProfile({ ...profile, instagram: e.target.value })} placeholder="Instagram username" className={`${inputCls} pl-9`} /></div>
              <div className="relative"><Facebook className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" /><input value={profile.facebook} onChange={e => setProfile({ ...profile, facebook: e.target.value })} placeholder="Facebook page URL" className={`${inputCls} pl-9`} /></div> */}
              <div className="relative"><Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-50" /><input value={profile.website} onChange={e => setProfile({ ...profile, website: e.target.value })} placeholder="Website (optional)" className={`${inputCls} pl-9`} /></div>
            </div>

            <div className={`rounded-xl p-4 flex items-center justify-between ${panel}`}>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className={`w-5 h-5 ${isDarkMode ? "text-slate-400" : "text-slate-500"}`} />
                <div>
                  <p className={`text-sm font-medium ${strong}`}>Basic Seller</p>
                  <p className={`text-xs ${muted}`}>Complete 5 sales to be considered for Verified/Trusted Seller status</p>
                </div>
              </div>
              <FileText className="w-4 h-4 opacity-40" />
            </div>

            <button onClick={saveProfile} className="w-full py-2.5 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-700 text-white">Save profile</button>
          </div>
        )}
      </div>
    </div>
  );
}
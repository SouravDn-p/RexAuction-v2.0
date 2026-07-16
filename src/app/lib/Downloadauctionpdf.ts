import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import type { AuctionItem } from "../../types/shared/auctionTypes";

// ─── Shared type ─────────────────────────────────────────────────────────────


export const isAuctionEnded = (auction: AuctionItem): boolean =>
  !!auction.endTime && new Date(auction.endTime) < new Date();

// ─── Shared PDF generator ─────────────────────────────────────────────────────
export const downloadAuctionPDF = (auction: AuctionItem): void => {
  const toastId = toast.loading("Generating PDF…");

  setTimeout(() => {
    try {
      const doc = new jsPDF();
      const PURPLE: [number, number, number] = [102, 51, 153];
      const LIGHT_PURPLE: [number, number, number] = [237, 233, 254];
      const DARK_TEXT: [number, number, number] = [30, 30, 30];
      const MID_TEXT: [number, number, number] = [90, 90, 90];
      const WHITE: [number, number, number] = [255, 255, 255];

      // ── Header band ──
      doc.setFillColor(...PURPLE);
      doc.rect(0, 0, 210, 18, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(...WHITE);
      doc.text("REX AUCTION", 14, 11);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Auction Details Report", 14, 16);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 145, 11);

      // ── Title ──
      let y = 30;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(...DARK_TEXT);
      doc.text(auction.name ?? "Untitled Auction", 14, y);
      y += 6;

      // ── Divider ──
      doc.setDrawColor(...PURPLE);
      doc.setLineWidth(0.6);
      doc.line(14, y, 196, y);
      y += 8;

      // ── Helper: label + value row ──
      const row = (label: string, value: string) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...MID_TEXT);
        doc.text(`${label}:`, 14, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...DARK_TEXT);
        doc.text(value, 68, y);
        y += 7;
      };

      // ── Section header ──
      const section = (title: string) => {
        y += 4;
        doc.setFillColor(...LIGHT_PURPLE);
        doc.roundedRect(12, y - 5, 184, 10, 2, 2, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(...PURPLE);
        doc.text(title, 16, y + 1);
        y += 10;
      };

      // ── Auction details ──
      section("Auction Information");
      row("Category", auction.category ?? "N/A");
      row("Starting Price", `$${auction.startingPrice ?? 0}`);
      row("Condition", auction.condition ?? "N/A");
      row("Year", auction.itemYear?.toString() ?? "N/A");
      row(
        "Status",
        isAuctionEnded(auction)
          ? "Ended"
          : (auction.status ?? "Pending")
      );
      row(
        "Start Time",
        auction.startTime
          ? new Date(auction.startTime).toLocaleString()
          : "N/A"
      );
      row(
        "End Time",
        auction.endTime
          ? new Date(auction.endTime).toLocaleString()
          : "N/A"
      );

      // ── Seller info ──
      section("Seller Information");
      row("Name", auction.sellerDisplayName ?? "Anonymous");
      row("Email", auction.sellerEmail ?? "N/A");

      // ── Description ──
      if (auction.description) {
        section("Description");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...DARK_TEXT);
        const lines = doc.splitTextToSize(auction.description, 182);
        doc.text(lines, 14, y);
        y += lines.length * 6 + 4;
      }

      // ── History ──
      if (auction.history) {
        section("History / Provenance");
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(...DARK_TEXT);
        const lines = doc.splitTextToSize(auction.history, 182);
        doc.text(lines, 14, y);
        y += lines.length * 6 + 4;
      }

      // ── Footer band ──
      doc.setFillColor(...PURPLE);
      doc.rect(0, 287, 210, 10, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...WHITE);
      doc.text(
        `Rex Auction © ${new Date().getFullYear()} · ${auction._id}`,
        105,
        293,
        { align: "center" }
      );

      doc.save(`auction-${auction._id}.pdf`);
      toast.success("PDF downloaded!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF", { id: toastId });
    }
  }, 400);
};
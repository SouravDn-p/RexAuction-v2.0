
import { jsPDF } from "jspdf";
import rexLogo from "../../assets/logo.png";

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNumber = (number: number | string) => {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || "0";
  };

interface Transaction {
  date: string | number | Date;
  description?: string;
  type: string;
  amount: number | string;
  status: string;
}

interface User {
  displayName?: string;
  name?: string;
  accountBalance: number | string;
  email?: string;
}

export const exportTransactionPdf = async ({ dbUser, filteredTransactions }: { dbUser: User, filteredTransactions: Transaction[] }) => {
    try {
      const doc = new jsPDF();

      const logoImg = new Image();
      logoImg.src = rexLogo;

      await new Promise((resolve) => {
        logoImg.onload = resolve;
      });

      doc.setFillColor(102, 51, 153);
      doc.rect(0, 0, 210, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Wallet Transaction History", 105, 8, { align: "center" });

      doc.addImage(logoImg, "PNG", 14, 15, 40, 15);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 35);

      doc.setLineWidth(0.5);
      doc.setDrawColor(102, 51, 153);
      doc.line(14, 40, 200, 40);

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(102, 51, 153);
      doc.text("Account Summary", 14, 50);

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);

      let yPos = 60;

      doc.setFont("helvetica", "bold");
      doc.text("Account Holder:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(dbUser?.displayName || dbUser?.name || "User", 60, yPos);
      yPos += 8;

      doc.setFont("helvetica", "bold");
      doc.text("Current Balance:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${formatNumber(dbUser?.accountBalance)} Taka`, 60, yPos);
      yPos += 8;

      doc.setFont("helvetica", "bold");
      doc.text("Email:", 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(dbUser?.email || "Not available", 60, yPos);
      yPos += 15;

      doc.setLineWidth(0.3);
      doc.setDrawColor(200, 200, 200);
      doc.line(14, yPos - 5, 200, yPos - 5);

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(102, 51, 153);
      doc.text("Transaction History", 14, yPos);
      yPos += 10;

      doc.setFillColor(240, 240, 250);
      doc.rect(14, yPos, 186, 8, "F");

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(102, 51, 153);
      doc.text("Date", 16, yPos + 5.5);
      doc.text("Description", 50, yPos + 5.5);
      doc.text("Amount", 120, yPos + 5.5);
      doc.text("Status", 170, yPos + 5.5);
      yPos += 8;

      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);

      const transactions = filteredTransactions;

      if (transactions.length === 0) {
        doc.text(
          "No transactions found matching your filters",
          105,
          yPos + 10,
          { align: "center" }
        );
      } else {
        transactions.forEach((transaction, index) => {
          if (index % 2 === 0) {
            doc.setFillColor(248, 248, 255);
            doc.rect(14, yPos, 186, 7, "F");
          }

          const date = formatDate(transaction.date);
          doc.text(date, 16, yPos + 5);

          let description = transaction.description || "N/A";
          if (description.length > 30) {
            description = description.substring(0, 27) + "...";
          }
          doc.text(description, 50, yPos + 5);

          if (transaction.type === "Deposit") {
            doc.setTextColor(46, 125, 50);
          } else {
            doc.setTextColor(198, 40, 40);
          }

          doc.text(`${formatNumber(transaction.amount)} Taka`, 120, yPos + 5);

          doc.setTextColor(0, 0, 0);

          if (transaction.status === "completed") {
            doc.setTextColor(46, 125, 50);
          } else {
            doc.setTextColor(255, 152, 0);
          }

          doc.text(
            transaction.status === "completed" ? "Completed" : "Pending",
            170,
            yPos + 5
          );

          doc.setTextColor(0, 0, 0);

          yPos += 7;

          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
        });
      }

      doc.setFillColor(102, 51, 153);
      doc.rect(0, 287, 210, 10, "F");

      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(
        "Rex Auction © " + new Date().getFullYear(),
        105,
        293,
        { align: "center" }
      );

      doc.save("wallet-transaction-history.pdf");
      alert("Transaction history has been exported as a PDF document.");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };
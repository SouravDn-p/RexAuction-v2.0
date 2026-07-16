import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import { format } from "date-fns";

export const generateDocx = async (title: string, isRTL: boolean, targetAudience: string, selectedGroups: string[], startDate: Date, endDate: Date, editorRef: React.RefObject<HTMLDivElement | null>) => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 28,
                }),
              ],
              bidirectional: isRTL,
              alignment: isRTL ? "right" : "left",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text:
                    "Target Audience: " +
                    (targetAudience === "all"
                      ? "All Users"
                      : Array.isArray(selectedGroups)
                        ? selectedGroups.join(", ")
                        : String(selectedGroups)),
                }),
              ],
              bidirectional: isRTL,
              alignment: isRTL ? "right" : "left",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text:
                    "Display Period: " +
                    (startDate ? format(startDate, "yyyy/MM/dd") : "N/A") +
                    " - " +
                    (endDate ? format(endDate, "yyyy/MM/dd") : "N/A"),
                }),
              ],
              bidirectional: isRTL,
              alignment: isRTL ? "right" : "left",
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "",
                }),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: editorRef.current ? editorRef.current.innerText : "",
                }),
              ],
              bidirectional: isRTL,
              alignment: isRTL ? "right" : "left",
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBlob(doc);
    saveAs(buffer, `${title || "Announcement"}.docx`);
  };
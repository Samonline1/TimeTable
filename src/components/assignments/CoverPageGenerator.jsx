import React, { useState } from "react";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import "./CoverPageGenerator.css";
import jsLogo from "./jsimg.jpg";

// save the pdf after editing 
const savePdfToFile = (pdfBytes, fileName) => {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

/**
 * @param {PDFDocument} pdfDoc 
 * @param {string} urle.
 */

const embedLocalImage = async (pdfDoc, url) => {
  const response = await fetch(url);
  const imageBytes = await response.arrayBuffer();
  // check fix for img
  if (url.toLowerCase().endsWith(".png")) {
    return await pdfDoc.embedPng(imageBytes);
  } else if (
    url.toLowerCase().endsWith(".jpg") ||
    url.toLowerCase().endsWith(".jpeg")
  ) {
    return await pdfDoc.embedJpg(imageBytes);
  } else {
    throw new Error("Unsupported image file type for embedding.");
  }
};

// single page genearation 
const generateSinglePDF = async (
  title,
  subCode,
  subject,
  fileName,
  name,
  roll,
  logoUrl
) => {
  const pdfDoc = await PDFDocument.create(); // for standard Times Roman font without external file

  const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold); 

  const A4_WIDTH = 595;
  const A4_HEIGHT = 842;
  const MARGIN_X = 80;
  const COL_SEP = 50;
  const CENTER_LINE_X = A4_WIDTH / 2;
  const TEXT_COLOR = rgb(0.1, 0.1, 0.1);
  const LINE_COLOR = rgb(0.5, 0.5, 0.5);
  const LINE_WIDTH = 0.5;
  const LINE_SPACING = 24; // Image Constants 
  const LOGO_SIZE = 120; // EMBED THE IMAGE
  let embeddedImage = null;
  try {
    embeddedImage = await embedLocalImage(pdfDoc, logoUrl);
  } catch (err) {
    console.error(
      "Failed to embed logo image. Check file path, file extension (.jpg/.png), and file size.",
      err
    );
  }

  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - 60; // Header (Title, ON, Sub Code, Subject) - Title: ASSIGNMENT FILE

  page.drawText(title.toUpperCase(), {
    x:
      CENTER_LINE_X -
      timesBoldFont.widthOfTextAtSize(title.toUpperCase(), 24) / 2,
    y,
    size: 24,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });
  y -= 40; // ON

  page.drawText("ON", {
    x: CENTER_LINE_X - timesBoldFont.widthOfTextAtSize("ON", 18) / 2,
    y,
    size: 18,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });
  y -= 30; // Sub Code

  page.drawText(`Sub Code: ${subCode}`, {
    x:
      CENTER_LINE_X -
      timesBoldFont.widthOfTextAtSize(`Sub Code: ${subCode}`, 16) / 2,
    y,
    size: 16,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });
  y -= 40; // Subject Name

  const subjectText = subject.toUpperCase();
  page.drawText(subjectText, {
    x: CENTER_LINE_X - timesBoldFont.widthOfTextAtSize(subjectText, 30) / 2,
    y,
    size: 30,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });
  y -= 50; // Logo Drawing 

  const LOGO_Y = y - LOGO_SIZE;
  const LOGO_X = CENTER_LINE_X - LOGO_SIZE / 2;

  if (embeddedImage) {
    // embed the img
    page.drawImage(embeddedImage, {
      x: LOGO_X,
      y: LOGO_Y,
      width: LOGO_SIZE,
      height: LOGO_SIZE,
    });
  } else {
    // if image failed 
    page.drawRectangle({
      x: LOGO_X,
      y: LOGO_Y,
      width: LOGO_SIZE,
      height: LOGO_SIZE,
      borderColor: LINE_COLOR,
      borderWidth: 1,
    });
    page.drawText("LOGO FAILED", {
      x: CENTER_LINE_X - timesFont.widthOfTextAtSize("LOGO FAILED", 12) / 2,
      y: LOGO_Y + LOGO_SIZE / 2 - 6,
      size: 12,
      font: timesFont,
      color: rgb(1, 0, 0), // Red text
    });
  }
  y = LOGO_Y - 30; //  y-axis logo space 

  page.drawText("J. S. UNIVERSITY, SHIKOHABAD", {
    x:
      CENTER_LINE_X -
      timesBoldFont.widthOfTextAtSize("J. S. UNIVERSITY, SHIKOHABAD", 20) / 2,
    y,
    size: 20,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });
  y -= 30;

  page.drawText("Session: 2025-26", {
    x:
      CENTER_LINE_X -
      timesBoldFont.widthOfTextAtSize("Session: 2025-26", 16) / 2,
    y,
    size: 16,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });
  y -= 70; // Large space before columns + Submitted By/To Columns

  const COL_START_Y = y;
  const SUB_TO_X = MARGIN_X;
  const SUB_BY_X = CENTER_LINE_X + COL_SEP / 2; // separator line 

  page.drawLine({
    start: { x: CENTER_LINE_X - COL_SEP / 2, y: COL_START_Y + 10 },
    end: { x: CENTER_LINE_X - COL_SEP / 2, y: COL_START_Y - 100 },
    color: LINE_COLOR,
    thickness: LINE_WIDTH,
  }); // Submitted To
  let y_left = COL_START_Y;
  page.drawText("Submitted To:", {
    x: SUB_TO_X,
    y: y_left,
    size: 16,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });
  y_left -= LINE_SPACING;
  page.drawText("Faculty Name", {
    x: SUB_TO_X,
    y: y_left,
    size: 16,
    font: timesFont,
    color: TEXT_COLOR,
  });
  y_left -= LINE_SPACING;
  page.drawText("Department of CSE", {
    x: SUB_TO_X,
    y: y_left,
    size: 16,
    font: timesFont,
    color: TEXT_COLOR,
  });
  y_left -= LINE_SPACING; // Submitted By 
  let y_right = COL_START_Y;
  page.drawText("Submitted By:", {
    x: SUB_BY_X,
    y: y_right,
    size: 16,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });
  y_right -= LINE_SPACING;
  page.drawText(`Student Name: ${name}`, {
    x: SUB_BY_X,
    y: y_right,
    size: 16,
    font: timesFont,
    color: TEXT_COLOR,
  });
  y_right -= LINE_SPACING;
  page.drawText(`Roll No.: ${roll}`, {
    x: SUB_BY_X,
    y: y_right,
    size: 16,
    font: timesFont,
    color: TEXT_COLOR,
  }); // save pdf
  const pdfBytes = await pdfDoc.save();
  savePdfToFile(pdfBytes, fileName);
};


export default function Assignments() {
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Pass the imported logo resource (jsLogo) to the PDF generator function

  const generateAllPDFs = async () => {
    if (!name || !roll) {
      setError("Please enter both name and roll number.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await generateSinglePDF(
        "Assignment File",
        "BTCS-501",
        "Database Management System",
        "DBMS_Assignment.pdf",
        name,
        roll,
        jsLogo
      );
      await generateSinglePDF(
        "Assignment File",
        "BTCS-503",
        "Design & Analysis of Algorithms",
        "DAA_Assignment.pdf",
        name,
        roll,
        jsLogo
      );
      await generateSinglePDF(
        "Assignment",
        "BTCS055",
        "Machine Learning",
        "ML_Assignment.pdf",
        name,
        roll,
        jsLogo
      );
    } catch (err) {
      setError(
        "Error generating PDF files. See console for details (e.g., image loading error)."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="assignment-panel">
      <h1 className="assignment-title">Assignment PDF Generator</h1>     {" "}
      {error && <div className="assignment-error">{error}</div>}     {" "}
      <label className="assignment-label">Name</label>
      {" "}
      <input
        className="assignment-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label className="assignment-label">Roll Number</label>
      {" "}
      <input
        className="assignment-input"
        value={roll}
        onChange={(e) => setRoll(e.target.value)}
      />
      {" "}
      <button
        className="assignment-btn"
        onClick={generateAllPDFs}
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Download All 3 PDFs"}     {" "}
      </button>
      {" "}
    </div>
  );
}

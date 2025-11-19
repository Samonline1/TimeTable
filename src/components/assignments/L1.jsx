import React, { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import "./L1.css";
import jsLogo from "./jsimg.jpg"; 

// Save
const savePdfToFile = (pdfBytes, fileName) => {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

// Base64
const urlToBase64 = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// ImageEmbed
const embedImageFromDataUrl = async (pdfDoc, dataUrl) => {
  if (dataUrl.startsWith("data:image/png")) {
    return await pdfDoc.embedPng(dataUrl);
  } else if (dataUrl.startsWith("data:image/jpeg") || dataUrl.startsWith("data:image/jpg")) {
    return await pdfDoc.embedJpg(dataUrl);
  } else {
    if (dataUrl.startsWith("data:image/")) {
      return await pdfDoc.embedJpg(dataUrl);
    }
    throw new Error("Unsupported or unrecognized image format for embedding.");
  }
};

// PDFGen
const generateSinglePDF = async (
  title,
  subCode,
  subject,
  fileName,
  name,
  roll,
  logoUrl
) => {
  const pdfDoc = await PDFDocument.create();
  const timesFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const timesBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const A4_WIDTH = 595;
  const A4_HEIGHT = 842;
  const MARGIN_X = 80;
  const CENTER_LINE_X = A4_WIDTH / 2;
  const TEXT_COLOR = rgb(0.1, 0.1, 0.1);
  const LINE_HEIGHT_SM = 20;

  const LOGO_WIDTH = 120;
  const LOGO_HEIGHT = 140;

  let embeddedImage = null;
  try {
    const logoBase64DataUrl = await urlToBase64(logoUrl);
    embeddedImage = await embedImageFromDataUrl(pdfDoc, logoBase64DataUrl);
  } catch (err) {
    console.error("LOGO EMBEDDING FAILED", err);
  }

  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

  // Header
  let y = A4_HEIGHT - 70;

  const titleText = title.toUpperCase();
  page.drawText(titleText, {
    x: CENTER_LINE_X - timesBoldFont.widthOfTextAtSize(titleText, 30) / 2,
    y,
    size: 30,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });

  y -= 40;

  const onText = "ON";
  page.drawText(onText, {
    x: CENTER_LINE_X - timesBoldFont.widthOfTextAtSize(onText, 20) / 2,
    y,
    size: 20,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });

  y -= 40;

  const subCodeText = `Sub Code: ${subCode}`;
  page.drawText(subCodeText, {
    x: CENTER_LINE_X - timesBoldFont.widthOfTextAtSize(subCodeText, 20) / 2,
    y,
    size: 20,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });

  y -= 50;

  const subjectText = subject.toUpperCase();
  page.drawText(subjectText, {
    x: CENTER_LINE_X - timesBoldFont.widthOfTextAtSize(subjectText, 28) / 2,
    y,
    size: 28,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });

  // Logo
  y -= 65;

  const LOGO_Y = y - LOGO_HEIGHT;
  const LOGO_X = CENTER_LINE_X - LOGO_WIDTH / 2;

  if (embeddedImage) {
    page.drawImage(embeddedImage, {
      x: LOGO_X,
      y: LOGO_Y,
      width: LOGO_WIDTH,
      height: LOGO_HEIGHT,
    });
  } else {
    const LINE_COLOR = rgb(0.5, 0.5, 0.5);
    page.drawRectangle({
      x: LOGO_X,
      y: LOGO_Y,
      width: LOGO_WIDTH,
      height: LOGO_HEIGHT,
      borderColor: LINE_COLOR,
      borderWidth: 1,
    });
    page.drawText("LOGO FAILED", {
      x: CENTER_LINE_X - timesFont.widthOfTextAtSize("LOGO FAILED", 12) / 2,
      y: LOGO_Y + LOGO_HEIGHT / 2 - 6,
      size: 12,
      font: timesFont,
      color: rgb(1, 0, 0),
    });
  }

  y = LOGO_Y - 75;

  // University
  const universityText = "J. S. UNIVERSITY, SHIKOHABAD";
  page.drawText(universityText, {
    x: CENTER_LINE_X - timesBoldFont.widthOfTextAtSize(universityText, 25) / 2,
    y,
    size: 25,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });

  y -= 30;

  const sessionText = "Session: 2025-26";
  page.drawText(sessionText, {
    x: CENTER_LINE_X - timesBoldFont.widthOfTextAtSize(sessionText, 20) / 2,
    y,
    size: 20,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });

  // Submit
  const SUBMISSION_CONTENT_HEIGHT = 100;
  const BOTTOM_MARGIN = 130;
  const SUBMISSION_START_Y =
    (BOTTOM_MARGIN + SUBMISSION_CONTENT_HEIGHT + 20) * 0.8;

  const SUB_TO_X = MARGIN_X;
  const SUB_BY_X = A4_WIDTH - MARGIN_X - 150;
  const VALUE_OFFSET = 100;

  let y_left = SUBMISSION_START_Y;

  page.drawText("Submitted to", {
    x: SUB_TO_X,
    y: y_left,
    size: 16,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });

  y_left -= LINE_HEIGHT_SM * 1.5;
  page.drawText("Pradeep Kumar", {
    x: SUB_TO_X,
    y: y_left,
    size: 16,
    font: timesFont,
    color: TEXT_COLOR,
  });

  y_left -= LINE_HEIGHT_SM;
  page.drawText("Assistant Professor (CSE)", {
    x: SUB_TO_X,
    y: y_left,
    size: 14,
    font: timesFont,
    color: TEXT_COLOR,
  });

  let y_right = SUBMISSION_START_Y;

  page.drawText("Submitted By", {
    x: SUB_BY_X,
    y: y_right,
    size: 16,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });

  y_right -= LINE_HEIGHT_SM * 1.5;
  page.drawText(`Student Name:`, {
    x: SUB_BY_X,
    y: y_right,
    size: 16,
    font: timesFont,
    color: TEXT_COLOR,
  });

  page.drawText(name, {
    x: SUB_BY_X + VALUE_OFFSET,
    y: y_right,
    size: 16,
    font: timesFont,
    color: TEXT_COLOR,
  });

  y_right -= LINE_HEIGHT_SM;

  page.drawText(`Enrollment No.:`, {
    x: SUB_BY_X,
    y: y_right,
    size: 16,
    font: timesFont,
    color: TEXT_COLOR,
  });

  page.drawText(roll, {
    x: SUB_BY_X + VALUE_OFFSET,
    y: y_right,
    size: 16,
    font: timesFont,
    color: TEXT_COLOR,
  });

  const pdfBytes = await pdfDoc.save();
  savePdfToFile(pdfBytes, fileName);
};

// Component
export default function Assignments() {
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const generateAllPDFs = async () => {
    if (!name || !roll) {
      setError("Please enter both name and roll number.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      await generateSinglePDF(
        "Assignment File", "BTCS-501", "Database Management System",
        "DBMS_Assignment.pdf", name, roll, jsLogo
      );
      await generateSinglePDF(
        "Assignment File", "BTCS-503", "Design & Analysis of Algorithms",
        "DAA_Assignment.pdf", name, roll, jsLogo
      );
      await generateSinglePDF(
        "Assignment", "BTCS055", "Machine Learning",
        "ML_Assignment.pdf", name, roll, jsLogo
      );
    } catch (err) {
      setError("Error generating PDF files.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // UI
  return (
    <div className="l1style">
      <div className="assignment-panel">
        <h1 className="assignment-title">Assignment PDF Generator</h1>
        {error && <div className="assignment-error">{error}</div>}
        <label className="assignment-label">Name</label>

        <input
          className="assignment-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="assignment-label">Roll Number</label>

        <input
          className="assignment-input"
          value={roll}
          onChange={(e) => setRoll(e.target.value)}
        />

        <button
          className="assignment-btn"
          onClick={generateAllPDFs}
          disabled={isLoading}
        >
          {isLoading ? "Generating..." : "Download All 3 PDFs"}
        </button>
      </div>

      <div>
        <div className="preview-wrapper ">

          {/* PREVIEW PAGES LEFT AS-IS, NO COMMENTS REMOVED HERE BECAUSE THEY ARE JSX COMMENTS */}

          <div className="preview-page">
            <div className="preview-title">ASSIGNMENT FILE</div>
            <div className="preview-subtext">ON</div>
            <div className="preview-subtext">Sub Code: BTCS-501</div>
            <div className="preview-subject">DATABASE MANAGEMENT SYSTEM</div>

            <br /><br />
            <center><img src={jsLogo} width="120" alt="University Logo" /></center>
            <br />

            <div className="preview-subtext">J. S. UNIVERSITY, SHIKOHABAD</div>
            <div className="preview-subtext">Session: 2025-26</div>

            <br /><br />
            <div className="submitSection">
              <div className="text-start">
                <b>Submitted to</b><br />
                Pradeep Kumar<br />
                Assistant Professor (CSE)
              </div>

              <br />

              <div className="text-start">
                <b>Submitted By</b><br />
                Student Name: {name || '___'}<br />
                Enrollment No.: {roll || '___'}
              </div>
            </div>
          </div>

          <div className="preview-page">
            <div className="preview-title">ASSIGNMENT FILE</div>
            <div className="preview-subtext">ON</div>
            <div className="preview-subtext">Sub Code: BTCS-503</div>
            <div className="preview-subject">DESIGN & ANALYSIS OF ALGORITHMS</div>

            <br /><br />
            <center><img src={jsLogo} width="120" alt="University Logo" /></center>
            <br />

            <div className="preview-subtext">J. S. UNIVERSITY, SHIKOHABAD</div>
            <div className="preview-subtext">Session: 2025-26</div>

            <br /><br />
            <div className="submitSection">
              <div className="text-start">
                <b>Submitted to</b><br />
                Pradeep Kumar<br />
                Assistant Professor (CSE)
              </div>

              <br />

              <div className="text-start">
                <b>Submitted By</b><br />
                Student Name: {name || '___'}<br />
                Enrollment No.: {roll || '___'}
              </div>
            </div>
          </div>

          <div className="preview-page">
            <div className="preview-title">ASSIGNMENT FILE</div>
            <div className="preview-subtext">ON</div>
            <div className="preview-subtext">Sub Code: BTCS-055</div>
            <div className="preview-subject">MACHINE LEARNING</div>

            <br /><br />
            <center><img src={jsLogo} width="120" alt="University Logo" /></center>
            <br />

            <div className="preview-subtext">J. S. UNIVERSITY, SHIKOHABAD</div>
            <div className="preview-subtext">Session: 2025-26</div>

            <br /><br />
            <div className="submitSection">
              <div className="text-start">
                <b>Submitted to</b><br />
                Pradeep Kumar<br />
                Assistant Professor (CSE)
              </div>

              <br />

              <div className="text-start">
                <b>Submitted By</b><br />
                Student Name: {name || '___'}<br />
                Enrollment No.: {roll || '___'}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

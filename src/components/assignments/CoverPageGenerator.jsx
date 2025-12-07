import React, { useState, useEffect } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import "./CoverPageGenerator.css";
import jsLogo from "./jsimg.jpg";
import { FaExternalLinkAlt } from "react-icons/fa";


// utils
const savePdfToFile = (pdfBytes, fileName) => {
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

const urlToBase64 = async (url) => {
  if (!url) throw new Error("No image URL provided");

  // If it's already a data URL, return as-is
  if (typeof url === "string" && url.startsWith("data:")) return url;

  // If it's a Blob/File already, convert with FileReader
  if (typeof Blob !== "undefined" && url instanceof Blob) {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(url);
    });
  }

  // Try fetching normally first
  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (fetchErr) {
    // Fallback: attempt to load the image into a canvas and extract data URL
    try {
      return await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const dataUrl = canvas.toDataURL("image/png");
            resolve(dataUrl);
          } catch (err) {
            reject(err);
          }
        };
        img.onerror = () => reject(new Error("Image load failed in fallback"));
        img.src = url;
      });
    } catch (fallbackErr) {
      throw fetchErr;
    }
  }
};

const embedImageFromDataUrl = async (pdfDoc, dataUrl) => {
  if (dataUrl.startsWith("data:image/png"))
    return await pdfDoc.embedPng(dataUrl);
  if (
    dataUrl.startsWith("data:image/jpeg") ||
    dataUrl.startsWith("data:image/jpg")
  )
    return await pdfDoc.embedJpg(dataUrl);
  if (dataUrl.startsWith("data:image/")) return await pdfDoc.embedJpg(dataUrl);
  throw new Error("Unsupported or unrecognized image format.");
};

// pdf
const generateSinglePDF = async (
  title,
  codeType,
  codeValue,
  subject,
  fileName,
  name,
  roll,
  course,
  submittedToName,
  submittedToDesignation,
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
    console.error("LOGO EMBEDDING FAILED.", err);
  }

  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  let y = A4_HEIGHT - 70;

  const titleText = title.toUpperCase();
  const titleSize = 30;
  page.drawText(titleText, {
    x:
      CENTER_LINE_X - timesBoldFont.widthOfTextAtSize(titleText, titleSize) / 2,
    y,
    size: titleSize,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });

  y -= 40;
  const onText = "ON";
  const onSize = 20;
  page.drawText(onText, {
    x: CENTER_LINE_X - timesBoldFont.widthOfTextAtSize(onText, onSize) / 2,
    y,
    size: onSize,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });

  y -= 40;
  const codeLabel = codeType === "subCode" ? "Sub Code" : "Lab Code";
  const codeDisplay = `${codeLabel}: ${codeValue}`;
  const codeSize = 20;
  page.drawText(codeDisplay, {
    x:
      CENTER_LINE_X -
      timesBoldFont.widthOfTextAtSize(codeDisplay, codeSize) / 2,
    y,
    size: codeSize,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });

  y -= 50;
  const subjectText = subject.toUpperCase();
  const subjectSize = 28;
  page.drawText(subjectText, {
    x:
      CENTER_LINE_X -
      timesBoldFont.widthOfTextAtSize(subjectText, subjectSize) / 2,
    y,
    size: subjectSize,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });

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
  const universityText = "J. S. UNIVERSITY, SHIKOHABAD";
  const universitySize = 25;
  page.drawText(universityText, {
    x:
      CENTER_LINE_X -
      timesBoldFont.widthOfTextAtSize(universityText, universitySize) / 2,
    y,
    size: universitySize,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });

  y -= 30;
  const sessionText = "Session: 2025-26";
  const sessionSize = 20;
  page.drawText(sessionText, {
    x:
      CENTER_LINE_X -
      timesBoldFont.widthOfTextAtSize(sessionText, sessionSize) / 2,
    y,
    size: sessionSize,
    font: timesBoldFont,
    color: TEXT_COLOR,
  });

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
  page.drawText(submittedToName, {
    x: SUB_TO_X,
    y: y_left,
    size: 16,
    font: timesFont,
    color: TEXT_COLOR,
  });

  y_left -= LINE_HEIGHT_SM;
  page.drawText(submittedToDesignation, {
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
    const EnrollmentDisplay = `Enrollment No: ${roll}`;
    page.drawText(EnrollmentDisplay, {
      x: SUB_BY_X,
      y: y_right,
      size: 14,
      font: timesFont,
      color: TEXT_COLOR,
    });

  if (course) {
    y_right -= LINE_HEIGHT_SM;
    const courseDisplay = `Course: ${course}`;
    page.drawText(courseDisplay, {
      x: SUB_BY_X,
      y: y_right,
      size: 14,
      font: timesFont,
      color: TEXT_COLOR,
    });
  }

  const pdfBytes = await pdfDoc.save();
  savePdfToFile(pdfBytes, fileName);
};

// default
const defaultDetails = [
  {
    title: "Assignment File",
    codeType: "subCode",
    codeValue: "BTCS-501",
    subject: "Database Management System",
    teacher: "Pradeep Kumar",
    designation: "Assistant Professor (CSE)",
    course: "",
  },
];
const defaultPreviewData = defaultDetails[0];

// component
export default function Assignments() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [name, setName] = useState("");
  const [roll, setRoll] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [customTitle, setCustomTitle] = useState("");
  const [customCodeType, setCustomCodeType] = useState("subCode");
  const [customCodeValue, setCustomCodeValue] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [customCourse, setCustomCourse] = useState("");
  const [customSubmittedToName, setCustomSubmittedToName] = useState("");
  const [customSubmittedToDesignation, setCustomSubmittedToDesignation] =
    useState("");

  const isCustomFieldFilled =
    customTitle ||
    customCodeValue ||
    customSubject ||
    customSubmittedToName ||
    customSubmittedToDesignation;

  const getPreviewData = () => {
    if (isCustomFieldFilled) {
      return {
        title: customTitle || "Assignment File",
        codeType: customCodeType,
        codeValue: customCodeValue || "N/A",
        subject: customSubject || "CUSTOM SUBJECT",
        teacher: customSubmittedToName || "Faculty Name",
        designation: customSubmittedToDesignation || "Designation",
        course: customCodeType === "labCode" ? customCourse : "",
      };
    }
    return defaultPreviewData;
  };

  const currentPreview = getPreviewData();

  const checkAccess = () => {
    const CORRECT_PASSWORD = "s6996";
    let enteredPassword = prompt(
      "Please enter the password to view the generator:"
    );
    if (enteredPassword === CORRECT_PASSWORD) setIsUnlocked(true);
    else if (enteredPassword !== null) {
      alert("Incorrect password. Access denied.");
      checkAccess();
    }
  };

  useEffect(() => {
    if (!isUnlocked) checkAccess();
  }, []);

  const generatePDFs = async () => {
    if (!name || !roll) {
      setError("Please enter both Name and Roll Number (Mandatory fields).");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      if (isCustomFieldFilled) {
        const finalTitle = customTitle || "Assignment File";
        const finalSubject = customSubject || "CUSTOM SUBJECT";
        const finalCodeValue = customCodeValue || "N/A";
        const finalSubmittedToName = customSubmittedToName || "Faculty Name";
        const finalSubmittedToDesignation =
          customSubmittedToDesignation || "Designation";

        const safeSubject = finalSubject.replace(/[^a-zA-Z0-9]/g, "_");
        const safeCode = finalCodeValue.replace(/[^a-zA-Z0-9]/g, "");
        const finalFileName = `${safeSubject}_${safeCode}_${name}.pdf`;
        const finalCourse = customCodeType === "labCode" ? customCourse : "";

        await generateSinglePDF(
          finalTitle,
          customCodeType,
          finalCodeValue,
          finalSubject,
          finalFileName,
          name,
          roll,
          finalCourse,
          finalSubmittedToName,
          finalSubmittedToDesignation,
          jsLogo
        );
      } else {
        const fullDefaultDetails = [
          {
            title: "Assignment File",
            codeType: "subCode",
            codeValue: "BTCS-501",
            subject: "Database Management System",
            fileName: "DBMS_Assignment.pdf",
            teacher: "Pradeep Kumar",
            designation: "Assistant Professor (CSE)",
            course: "",
          },
          {
            title: "Assignment File",
            codeType: "subCode",
            codeValue: "BTCS-503",
            subject: "Design & Analysis of Algorithms",
            fileName: "DAA_Assignment.pdf",
            teacher: "Pradeep Kumar",
            designation: "Assistant Professor (CSE)",
            course: "",
          },
          {
            title: "Assignment",
            codeType: "subCode",
            codeValue: "BTCS055",
            subject: "Machine Learning",
            fileName: "ML_Assignment.pdf",
            teacher: "Pradeep Kumar",
            designation: "Assistant Professor (CSE)",
            course: "",
          },
        ];

        for (const defaults of fullDefaultDetails) {
          await generateSinglePDF(
            defaults.title,
            defaults.codeType,
            defaults.codeValue,
            defaults.subject,
            defaults.fileName,
            name,
            roll,
            defaults.course,
            defaults.teacher,
            defaults.designation,
            jsLogo
          );
        }
      }
    } catch (err) {
      setError("Error generating PDF files.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div style={{ color: "white", padding: "50px", textAlign: "center" }}>
        <p>Awaiting password...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
    
    
      <div className=" header-bar py-5 flex flex-col justify-center items-center mb-4 gap-2  border-b border-gray-900 mt-3">
        <p className="text-2xl font-bold">JSU Front Page Generator</p>
        <p className="uppercase text-gray-500 mb-5 text-sm lg:text-md">
          Generate frontpage and download pdf
        </p>
      </div>
      
    <div className="assignmentpage flex flex-col lg:flex-row items-start lg:items-center justify-center w-full">

      

      <div className="assignment-panel">
        <h1 className="assignment-title">Enter Your Details</h1>
        {error && <div className="assignment-error">{error}</div>}

        <div className="input-group">
          <label className="assignment-label mandatory">Student Name</label>
          <input
            className="assignment-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="assignment-label mandatory">Enrollment No.</label>
          <input
            className="assignment-input"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
          />
        </div>

        <hr />
        <h3>Optional Details</h3>

        <div className="input-group">
          <label className="assignment-label">Title</label>
          <input
            className="assignment-input"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
          />

          <label className="assignment-label">Subject</label>
          <input
            className="assignment-input"
            value={customSubject}
            onChange={(e) => setCustomSubject(e.target.value)}
          />
        </div>

        <div className="input-group-inline">
          <div style={{ flex: 1 }}>
            <label className="assignment-label">Code Type</label>
            <select
              className="assignment-input"
              value={customCodeType}
              onChange={(e) => setCustomCodeType(e.target.value)}
            >
              <option value="subCode">Sub Code</option>
              <option value="labCode">Lab Code</option>
            </select>
          </div>
          <div style={{ flex: 2, marginLeft: "10px" }}>
            <label className="assignment-label">Code Value</label>
            <input
              className="assignment-input"
              value={customCodeValue}
              onChange={(e) => setCustomCodeValue(e.target.value)}
            />
          </div>
        </div>

        {customCodeType === "labCode" && (
          <div className="input-group">
            <label className="assignment-label">Course</label>
            <input
              className="assignment-input"
              value={customCourse}
              onChange={(e) => setCustomCourse(e.target.value)}
            />
          </div>
        )}

        <hr />

        <div className="input-group">
          <label className="assignment-label">
            Submitted To (Teacher Name)
          </label>
          <input
            className="assignment-input"
            value={customSubmittedToName}
            onChange={(e) => setCustomSubmittedToName(e.target.value)}
          />

          <label className="assignment-label">Designation</label>
          <input
            className="assignment-input"
            value={customSubmittedToDesignation}
            onChange={(e) => setCustomSubmittedToDesignation(e.target.value)}
          />
        </div>

        <button
          className="assignment-btn"
          onClick={generatePDFs}
          disabled={isLoading}
        >
          {isLoading
            ? "Generating..."
            : isCustomFieldFilled
            ? "Download Custom PDF"
            : "Download All 3 Default PDFs"}
        </button>
      </div>

      <div>
        <div className="preview-wrapper single-preview">
          <div className="preview-page">
            <div className="preview-title">
              {currentPreview.title.toUpperCase()}
            </div>
            <div className="preview-subtext">ON</div>
            <div className="preview-subtext">
              {currentPreview.codeType === "subCode" ? "Sub Code" : "Lab Code"}:{" "}
              {currentPreview.codeValue}
            </div>
            <div className="preview-subject">
              {currentPreview.subject.toUpperCase()}
            </div>

            <br />
            <br />
            <center>
              <img src={jsLogo} width="120" alt="University Logo" />
            </center>
            <br />

            <div className="preview-subtext">J. S. UNIVERSITY, SHIKOHABAD</div>
            <div className="preview-subtext">Session: 2025-26</div>

            <br />
            <br />

            <div className="submitSection">
              <div className="text-start">
                <b>Submitted to</b>
                <br />
                {currentPreview.teacher}
                <br />
                {currentPreview.designation}
              </div>

              <br />

              <div className="text-start">
                <b>Submitted By</b>
                <br />
                Student Name: {name}
                <br />
                Enrollment No: {roll}
                {currentPreview.course &&
                  currentPreview.codeType === "labCode" && (
                    <div style={{ fontSize: "0.85em", marginTop: "5px" }}>
                      Course: {currentPreview.course}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="w-full lg:w-full flex justify-center items-center mt-10 pb-5  hover:scale-105 transition-all ">
                                            <a
                      href="https://www.instagram.com/jsulabs"
                      className=" flex  justify-center w-full  p-1  rounded-xl text-gray-800 font-semibold tracking-wide hover:text-blue-400 text-gray-500 transition text-sm"
                    >
                      Built by @JsuLabs <span className="px-2 flex  justify-center items-center "><FaExternalLinkAlt />
</span>
                    </a>
                                        </div>
    </div>
  );
}

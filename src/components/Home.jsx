import React, { useEffect, useState } from "react";
import examData from "../data/datesheet.json";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  const [course, setCourse] = useState("");
  const [branch, setBranch] = useState("");
  const [sem, setSem] = useState("");

  const selectedCourse = examData.courses.find((c) => c.id === course);
  const selectedBranch = selectedCourse?.branches.find((b) => b.id === branch);

  const handleSemSelect = (semId) => {
    setSem(semId);

    const newEntry = { course, branch, sem: semId, time: Date.now() };

    let existing = [];

    try {
      const stored = JSON.parse(localStorage.getItem("studentData"));
      if (Array.isArray(stored)) {
        existing = stored;
      }
    } catch (e) {
      console.log("LocalStorage corrupted, resetting.");
    }

    const updated = [...existing, newEntry];
    localStorage.setItem("studentData", JSON.stringify(updated));

    navigate(`/${course}/${branch}/${semId}`);
  };

  //   const handleSemSelect = (semId) => {
  //     setSem(semId);

  //     // const studentData = { course, branch, sem: semId };
  //     // localStorage.setItem("studentData", JSON.stringify(studentData));

  //  // Step 1: Fetch old array or create new one
  //      const existing = JSON.parse(localStorage.getItem("studentData")) || [];

  //   // Step 2: Create new entry
  //   const newEntry = {
  //     course,
  //     branch,
  //     sem: semId,
  //     time: Date.now() // optional
  //   };

  //   existing.push(newEntry);

  //   // Step 4: Save updated array
  //   localStorage.setItem("studentData", JSON.stringify([...existing, existing]));

  //     console.log("Navigating to:", course, branch, semId);

  //           navigate(`/${course}/${branch}/${semId}`);

  //   };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-gray-950 text-white p-2 lg:p-10 ">
      <div className="lg:absolute flex flex-col justify-center items-center mb-4  gap-2 w-full lg:w-[90%] border-b border-gray-900 mt-3">
        <p className="text-2xl font-bold">JS Exam Time Table</p>
        <p className="uppercase text-gray-500 mb-5 text-sm lg:text-md">
          Odd Semster examination 2025-2026
        </p>
      </div>

      {/* LEFT SIDE – COURSE SELECT */}
      <div className="flex flex-col gap-4 w-full lg:w-[28%] items-center justify-center lg:pt-10 px-4 ">
        <h1 className="text-2xl font-bold mb-2">Select Your Course</h1>

        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {examData.courses.map((c, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCourse(c.id);
                setBranch("");
                setSem("");
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.12 }}
              className={`p-4 rounded-xl text-lg font-semibold transition 
                ${course === c.id
                  ? "bg-blue-600"
                  : "bg-gray-800 hover:bg-gray-700 shine-btn"
                }`}
            >
              {c.id.toUpperCase()}
            </motion.button>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE – SLIDING PANEL */}
      {selectedCourse && (
        <div
          className="lg:ml-5 lg:mt-35 absolute lg:static inset-0 lg:inset-auto bg-gray-900/20 opacity-100 backdrop-blur-xl lg:bg-gray-900/70 
                        w-full lg:w-[70%] h-full lg:h-auto p-6 rounded-xl shadow-lg 
                        flex flex-col gap-6 justify-center items-center"
        >
          {/* BRANCH SELECT */}
          <div className="w-full max-w-xl max-h-[30vh] overflow-y-auto no-scrollbar px-3">
            <h2 className="text-xl font-bold mb-3">Select Branch</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 ">
              {selectedCourse.branches.map((b, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setBranch(b.id);
                    setSem("");
                  }}
                  className={`p-3 rounded-lg text-lg transition 
                  ${branch === b.id
                      ? "bg-green-600"
                      : "bg-gray-800 hover:bg-gray-700 shine-btn"
                    }`}
                >
                  {b.id}
                </button>
              ))}
            </div>
          </div>

          {/* SEM SELECT */}
          {selectedBranch && (
            <div className="w-full max-w-xl max-h-[30vh] overflow-y-auto no-scrollbar px-4">
              <h2 className="text-xl font-bold mb-3">Select Semester</h2>

              <div className="grid grid-cols-6 w-full gap-2 ">
                {selectedBranch.semesters.map((s, index) => (
                  <button
                    key={index}
                    onClick={() => handleSemSelect(s.id)}
                    className="p-3 rounded-lg text-lg bg-gray-800 hover:bg-gray-700 flex justify-center items-center"
                  >
                    {s.id}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;

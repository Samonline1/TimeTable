import React, { useState } from "react";
import examData from "../data/datesheet.json";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // console.log(examData['B.Tech']['All Branches']['Semester 1']);
  //   console.log(examData['B.Tech']);

  // const csSem5 = examData["B.Tech"]["CS"]["Semester 5"];
  // console.log(csSem5);

  const navigate = useNavigate();
  console.log(examData.courses[0].branches[0].semesters[0].subjects[0].name);

  console.log(examData.courses.map((e) => e.name));

  const [course, setCourse] = useState("");
  // setted as string it considred number as string
  // console.log(examData.courses[course].branches.map((b)=> b.name));
  console.log(
    examData.courses.find((c) => c.id === course)?.branches.map((b) => b.id)
  );

  var findBranch = examData.courses.find((c) => c.id === course); // found selected course

  const [branch, setBranch] = useState("");

  var findSem = findBranch?.branches.find((b) => b.id === branch); // to find selected branch
  console.log(findSem);

  const [sem, setSem] = useState("");
  console.log(sem);

  const checkTimeTable = (e) => {
    setSem(e);

    const studentData = { course, branch, sem: e };
    localStorage.setItem("studentData", JSON.stringify(studentData));
    navigate(`/${course}/${branch}/${e}`);
  };

  return (
    <div className="flex h-[100vh] w-screen bg-red-700 gap-6 p-10">
      {examData &&
        examData.courses.map((course, index) => (
          <div key={index}>
            <button
              className="h-30 w-30 bg-blue-700 p-4"
              onClick={() => setCourse(course.id)}
            >
              {course.id.toUpperCase()}
            </button>
          </div>
        ))}

      {findBranch && (
        <div className="absolute bg-green-700 w-[90%] h-[90%] p-10">
          <div className="flex gap-3 p-5 ">
            {findBranch.branches.map((branch, index) => (
              <div key={index}>
                <button
                  className="h-30 w-30 bg-blue-700 p-4"
                  onClick={() => setBranch(branch.id)}
                >
                  {branch.id}
                </button>
              </div>
            ))}
          </div>

          {findSem && (
            <div className="flex gap-3 p-5">
              {findSem.semesters.map((sem, index) => (
                <button
                  className="h-30 w-30 bg-blue-700 p-4"
                  onClick={() => setSem(() => checkTimeTable(sem.id))}
                  key={index}
                >
                  {sem.id}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;

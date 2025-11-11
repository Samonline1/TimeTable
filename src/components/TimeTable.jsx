import React from 'react'
import { useParams } from 'react-router-dom'
import examData from "../data/datesheet.json";


const TimeTable = () => {

    const storedData = localStorage.getItem("studentData");
    const studentDetails = storedData ? JSON.parse(storedData) : null;
    if (!studentDetails) return <p>Not Found!</p>;


    const { courseId, branchId, semId } = useParams();

    const course = examData.courses.find(c => c.id === courseId);
    //   console.log(course);

    const branch = course.branches.find(b => b.id === branchId);
    //   console.log(branch);

    const semester = branch.semesters.find(s => s.id === semId);
    //   console.log(semester);




    return (
        <div>TimeTable
            <div>
                {semester && (
                    semester.subjects.map((subject, index) => (
                        <div key={index}>
                            <p>{subject.name}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default TimeTable
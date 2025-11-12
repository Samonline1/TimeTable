import React from 'react'
import { useParams } from 'react-router-dom'
import examData from "../data/datesheet.json";
import Calendar from './Calender';




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
        <div className='h-full lg:h-[100vh] max-[639px]:w-100 lg:w-screen overflow-x-hidden bg-green-400'>
            <h1>TimeTable</h1>

        <div className='flex lg:flex-row flex-col justify-center items-center bg-blue-600'>

            

 <div className=' bg-red-600 p-5 m-10 flex sm:flex-row lg:flex-col gap-5 lg:w-[35%] w-[90%] lg:h-120 overflow-x-auto [&::-webkit-scrollbar]:hidden '>
            <Calendar year={2025} month={10} examDate={semester.subjects.map(d => d.Date)}/>

            <Calendar year={2025} month={11} examDate={semester.subjects.map(d => d.Date)}/>
            <Calendar year={2025} month={12} examDate={semester.subjects.map(d => d.Date)}/>
                        </div>

            <div className=' bg-red-900  lg:h-120 h-60 lg:w-[50%] w-[90%] mb-5 overflow-y-auto [&::-webkit-scrollbar]:hidden'>
                {semester && (
                    semester.subjects.map((subject, index) => (
                        <div 
                        className='p-2 overflow-y-auto '
                         key={index}>
                            <div className='flex  bg-gray-900 p-5 rounded-lg gap-2'>
                                <div className=' flex flex-col justify-center items-center mr-2 pr-3  border-r'>
                                <p className='text-xl'>25 </p>
                                <p className='text-gray-400 text-sm'>nov</p>
                                </div>
                                <div className='flex justify-between w-full'>
                                <p className='w-[60%]'>{subject.name}</p>
                                <p>2D : 23H : 08M</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>


</div>
        </div>
    )
}

export default TimeTable
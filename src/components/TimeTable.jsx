import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import examData from "../data/datesheet.json";
import Calendar from "./Calender";
useEffect;

const TimeTable = () => {
    const storedData = localStorage.getItem("studentData");
    const studentDetails = storedData ? JSON.parse(storedData) : null;
    if (!studentDetails) return <p>Not Found!</p>;

    const { courseId, branchId, semId } = useParams();

    const course = examData.courses.find((c) => c.id === courseId);
    //   console.log(course);

    const branch = course.branches.find((b) => b.id === branchId);
    //   console.log(branch);

    const semester = branch.semesters.find((s) => s.id === semId);
    //   console.log(semester);

    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    // for countdown
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setNow(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // console.log(now);

    // *alternative
    // const tio = new Date();
    // console.log(tio);

    // function for countrdown

    const getRemainingTime = (subject) => {
        const startDateTime = new Date(`${subject.Date} ${subject.startTime}`);
        const endDateTime = new Date(`${subject.Date} ${subject.endTime}`);

        let diffMs;
        let phase;
        let color;

        if (now < startDateTime) {
            // Phase 1: Countdown to exam start - in future
            diffMs = startDateTime - now;
            phase = "Upcoming";
            color = "bg-gray-700"


        } else if (now >= startDateTime && now <= endDateTime) { // bigger than satrtExam but smaller than endExam
            // Phase 2: Countdown while examination
            diffMs = endDateTime - now;
            phase = "Ongoing";
            color = "bg-green-800";

        } else {
            // After exam end - after examTime
            diffMs = 0;
            phase = "Finished";
            color = "bg-red-700";
        }

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
        const seconds = Math.floor((diffMs / 1000) % 60);





        return { days, hours, minutes, seconds, phase, color };
    };


    // while exam is goingOn

    // const threeHours = 3 * 60 * 60 * 1000; // 3 hours in MS

    // const getRemainingTime = (subject) => {
    //     const startDate = new Date(`${subject.Date} ${subject.startTime}`);
    //     const diffinMS = startDate - now;


    //     if (diffinMS <= 0) {
    //         const paperCountDown = new Date (startDate.getTime() + threeHours) ; // adding 3 hours to starting time
    //         diffinMS = paperCountDown - now ;
    //         console.log(paperCountDown);

    //         if (diffinMS <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };



    //     } 
    //          const days = Math.floor(diffinMS / (1000 * 60 * 60 * 24));
    //     const hours = Math.floor((diffinMS / (1000 * 60 * 60)) % 24);
    //     const minutes = Math.floor((diffinMS / (1000 * 60)) % 60);
    //     const seconds = Math.floor((diffinMS / 1000) % 60);

    //     return { days, hours, minutes, seconds };


    //     // if (diffinMS <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };


    // };

    const [showInfo, setShowInfo] = useState(false);
    // const [code, setCode] = useState("");
    const [subject, setSubject] = useState("");
    const [index, setIndex] = useState("");


    const showDetails = (code, index) => {
        setShowInfo(!showInfo);
        // setCode(code);
        const detailsModal = semester.subjects.find(subject => subject.code === code);
        console.log(detailsModal, index);
        setSubject(detailsModal)
        setIndex(index)


    }


    return (
        <div className="h-full lg:h-[100vh] max-[639px]:w-100 lg:w-screen overflow-x-hidden bg-green-400">
            <h1>TimeTable</h1>

            <div className="flex lg:flex-row flex-col justify-center items-center bg-blue-600">


                {showInfo && (
                    <div className=" flex justify-center items-center absolute bg-blue-700 opacity-80 w-full h-full">
                        <div className=" flex justify-between  p-10 w-100 h-100 bg-red-800">

                            {subject && subject.length !== "" ?
                                <div>

                                    <h1>{subject.code}</h1>
                                    <p>{subject.name}</p>

                                    <div className="flex w-full gap-2">
                                        <p className='text-xl'>{(subject.Date).split("-")[2]}</p>
                                        <p className='text-gray-400 text-xl'>
                                            {monthNames[(subject.Date).split("-")[1] - 1]}
                                        </p>
                                        <p className='text-xl'>{(subject.Date).split("-")[0]}</p>

                                    </div>

                                    <div className="flex gap-2">
                                        <p>{subject.startTime}</p>
                                        <p>- {subject.endTime}</p>
                                    </div>

                                    <p>{index + 1}st</p>

                                    <p>{subject.shift}</p>


                                </div> : <p>not found</p>}
                            <button className="h-10 flex justify-center items-center" onClick={() => setShowInfo(!showInfo)} >X</button>
                        </div>
                    </div>

                )}



                <div className=" bg-red-600 p-5 m-10 flex sm:flex-row lg:flex-col gap-5 lg:w-[35%] w-[90%] lg:h-120 overflow-x-auto [&::-webkit-scrollbar]:hidden ">
                    <Calendar
                        year={2025}
                        month={10}
                        examDate={semester.subjects.map((d) => d.Date)}
                    />

                    <Calendar
                        year={2025}
                        month={11}
                        examDate={semester.subjects.map((d) => d.Date)}
                    />
                    <Calendar
                        year={2025}
                        month={12}
                        examDate={semester.subjects.map((d) => d.Date)}
                    />
                </div>


                <div className=' lg:h-120 h-60 lg:w-[50%] w-[90%] mb-5 overflow-y-auto [&::-webkit-scrollbar]:hidden'>
                    {semester && (
                        semester.subjects.map((subject, index) => {
                            // Call getRemaining function here 
                            const { days, hours, minutes, seconds, phase, color } = getRemainingTime(subject);

                            return (
                                <div
                                    onClick={() => showDetails(subject.code, index)}
                                    className='p-2 overflow-y-auto cursor-pointer hover:bg-gray-800 rounded-lg' key={index}>
                                    <div
                                        className="flex bg-gray-900 p-5 rounded-lg gap-2"

                                    >

                                        <div className='flex flex-col justify-center items-center mr-2 pr-3 border-r border-gray-700'>
                                            <p className='text-xl'>{(subject.Date).split("-")[2]}</p>
                                            <p className='text-gray-400 text-sm'>
                                                {monthNames[(subject.Date).split("-")[1] - 1]}
                                            </p>
                                        </div>


                                        <div className='flex  justify-between w-full'>
                                            <div className='flex flex-col justify-between w-full'

                                            >
                                                <p className='w-[60%] font-bold'>{subject.name}</p>

                                                {/* destructing countdown object */}
                                                <p className='text-gray-400'>
                                                    {days}D : {hours}H : {minutes}M : {seconds}S
                                                </p>

                                            </div>

                                            <div className="flex flex-col items-end justify-between">
                                                <p className={`text-sm rounded gap-2 px-2 ${color}`}>{phase}</p>

                                                <p className='text-gray-400'>{subject.shift}</p>

                                            </div>

                                        </div>


                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>




                {/* <div className=" bg-red-900  lg:h-120 h-60 lg:w-[50%] w-[90%] mb-5 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    {semester &&
                        semester.subjects.map((subject, index) => (
                            <div className="p-2 overflow-y-auto" key={index}>
                                <div className="flex  bg-gray-900 p-5 rounded-lg gap-2">
                                    <div className=" flex flex-col justify-center items-center mr-2 pr-3  border-r">
                                        <p className="text-xl">{subject.Date.split("-")[2]} </p>
                                        <p className="text-gray-400 text-sm">
                                            {monthNames[subject.Date.split("-")[1] - 1]}
                                        </p>
                                    </div>
                                    <div className="flex justify-between w-full">
                                        <p className="w-[60%]">{subject.name}</p>
                                        <p>{getRemainingTime(subject)}</p>
                                        <p>2D : 23H : 08M</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div> */}


            </div>
        </div>
    );
};

export default TimeTable;

/// exam date start date and starting time +
// current date and time = start - current = miliseconds (floor to d,h,m,m) at 0 start new 3 h timer
// start time end time with same date - run something with 3 hours of countdown at 0 make it red done

// if (endDateTime < now) {
//   // if 1:30 PM has already passed today, use tomorrow
//   endDateTime.setDate(endDateTime.getDate() + 1);
// }

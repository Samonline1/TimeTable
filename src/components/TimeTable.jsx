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
            color = "bg-gray-700";
        } else if (now >= startDateTime && now <= endDateTime) {
            // bigger than satrtExam but smaller than endExam
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
    const [extra, setExtra] = useState("");

    const showDetails = (code, phase, color) => {
        setShowInfo(!showInfo);
        // setCode(code);
        const detailsModal = semester.subjects.find(
            (subject) => subject.code === code
        );
        console.log(detailsModal);
        setSubject(detailsModal);
        setExtra({ phase, color });
    };

    const findSub = (date) => {
        const dayNum = Number(date); // ensure number

        const details = semester.subjects.find((subject) => {
            const subDay = Number(subject.Date?.split("-")[2]); // convert to number
            return subDay === dayNum;
        });

        if (!details) {
            console.log("No subject found on this date");
            return;
        }

        const { phase, color } = getRemainingTime(details);

        //   console.log(detailsModal.code);
        showDetails(details.code, phase, color);
    };

    return (
        <div className="h-full lg:h-full max-[639px]:w-100 lg:w-screen overflow-x-hidden">
            <h1>TimeTable</h1>

            <div className="flex lg:flex-row flex-col justify-center items-center h-full w-full">
                {showInfo && (
                    <div className=" flex justify-center items-center absolute bg-black h-[100vh] w-screen">
                        <div className="relative  flex justify-between  p-5 w-100 h-100 bg-gray-900 rounded-xl">
                            {subject && subject.length !== "" ? (
                                <div className="w-full h-full">
                                    <button
                                        className="h-10 top-0 right-0 absolute z-10"
                                        onClick={() => setShowInfo(!showInfo)}
                                    >
                                        X
                                    </button>

                                    <div className="flex flex-col justify-center w-full h-full relative space-y-20">
                                        <div className=" flex gap-2 w-30">
                                            <p className={`p-1  text-sm rounded ${extra.color}`}>
                                                {extra.phase}
                                            </p>
                                        </div>

                                        <div className="flex flex-col justify-center items-center w-full relative ">
                                            <h1 className="font-bold">{subject.code}</h1>
                                            <p>{subject.name}</p>

                                            <div className="flex justify-center items-center gap-2  w-full text-gray-400">
                                                <p className="text-xl">{subject.Date?.split("-")[2]}</p>
                                                <p className=" text-xl">
                                                    {monthNames[subject.Date?.split("-")[1] - 1]}
                                                </p>
                                                <p className="text-xl">{subject.Date?.split("-")[0]}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-end gap-2">
                                            <div>
                                                <p>Shift: {subject.shift}</p>
                                                {/* <p>Paper: {extra.index + 1}</p> */}
                                                <p>{subject.paper}</p>
                                            </div>
                                            <div>
                                                <p>{subject.startTime}</p>
                                                <p>{subject.endTime}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    {" "}
                                    <button
                                        className="h-10 top-0 right-0 absolute z-10"
                                        onClick={() => setShowInfo(!showInfo)}
                                    >
                                        X
                                    </button>
                                    <h1 className=" py-30 font-bold">Not a Exam Day!</h1>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className=" p-5 m-10 flex sm:flex-row lg:flex-row gap-5  lg:h-110 lg:w-[40%] w-[90%]  w-[90%] overflow-x-auto [&::-webkit-scrollbar]:hidden ">
                    <Calendar
                        year={2025}
                        month={10}
                        examDate={semester.subjects.map((d) => d.Date)}
                        CalDate={findSub}
                    />

                    <Calendar
                        year={2025}
                        month={11}
                        examDate={semester.subjects.map((d) => d.Date)}
                        CalDate={findSub}
                    />
                    <Calendar
                        year={2025}
                        month={12}
                        examDate={semester.subjects.map((d) => d.Date)}
                        CalDate={findSub}
                    />
                </div>

                <div className=" lg:h-120 h-60 lg:w-[50%] w-[90%] mb-5 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                    {semester &&
                        semester.subjects.map((subject, index) => {
                            // Call getRemaining function here
                            const { days, hours, minutes, seconds, phase, color } =
                                getRemainingTime(subject);

                            return (
                                <div
                                    onClick={() => showDetails(subject.code, phase, color)}
                                    className="p-2 overflow-y-auto cursor-pointer hover:bg-gray-800 rounded-lg"
                                    key={index}
                                >
                                    <div className="flex bg-gray-900 p-5 rounded-lg gap-2">
                                        <div className="flex flex-col justify-center items-center mr-2 pr-3 border-r border-gray-700">
                                            <p className="text-xl">{subject.Date?.split("-")[2]}</p>
                                            <p className="text-gray-400 text-sm">
                                                {monthNames[subject.Date?.split("-")[1] - 1]}
                                            </p>
                                        </div>

                                        <div className="flex  justify-between w-full">
                                            <div className="flex flex-col justify-between w-full">
                                                <p className="w-[60%] font-bold">{subject.name}</p>

                                                {/* destructing countdown object */}
                                                <p className="text-gray-400">
                                                    {days}D : {hours}H : {minutes}M : {seconds}S
                                                </p>
                                            </div>

                                            <div className="flex flex-col items-end justify-between">
                                                <p className={`text-sm rounded gap-2 px-2 ${color}`}>
                                                    {phase}
                                                </p>

                                                <p className="text-gray-400">{subject.shift}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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

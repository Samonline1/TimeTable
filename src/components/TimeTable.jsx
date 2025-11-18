import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import examData from "../data/datesheet.json";
import Calendar from "./Calender";
import { motion } from "framer-motion";
import History from "./History";

const TimeTable = () => {
    const navigate = useNavigate();
    const storedData = localStorage.getItem("studentData");
    const studentDetails = storedData ? JSON.parse(storedData) : null;
    if (!studentDetails) return <p>Not Found!</p>;

    const { courseId, branchId, semId } = useParams();

    const course = examData.courses.find((c) => c.id === courseId);
    const branch = course.branches.find((b) => b.id === branchId);
    const semester = branch.semesters.find((s) => s.id === semId);

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

    const [now, setNow] = useState(new Date());
    const [showInfo, setShowInfo] = useState(false);
    const [subject, setSubject] = useState("");
    const [extra, setExtra] = useState("");

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getRemainingTime = (subject) => {
        const startDateTime = new Date(`${subject.Date} ${subject.startTime}`);
        const endDateTime = new Date(`${subject.Date} ${subject.endTime}`);

        let diffMs;
        let phase;
        let color;

        if (now < startDateTime) {
            diffMs = startDateTime - now;
            phase = "Upcoming";
            color = "bg-gray-700";
        } else if (now >= startDateTime && now <= endDateTime) {
            diffMs = endDateTime - now;
            phase = "Ongoing";
            color = "bg-green-800";
        } else {
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

    const showDetails = (code, phase, color) => {
        setShowInfo(true);
        const details = semester.subjects.find((subject) => subject.code === code);
        setSubject(details);
        setExtra({ phase, color });
    };

    const findSub = (date) => {
        const dayNum = Number(date);

        const details = semester.subjects.find((subject) => {
            const subDay = Number(subject.Date?.split("-")[2]);
            return subDay === dayNum;
        });

        if (!details) return;

        const { phase, color } = getRemainingTime(details);
        showDetails(details.code, phase, color);
    };

    // opening only animation
    const [showIntro, setShowIntro] = useState(true);

    const hasPlayed = useRef(false);

    useEffect(() => {
        if (!hasPlayed.current) {
            hasPlayed.current = true;
            setTimeout(() => setShowIntro(false), 1500);
        }
    }, []);

    const IntroAnimation = () => (
        <div className="flex items-center justify-center h-screen w-screen bg-gray-950">
            <motion.div
                className="h-15 w-15 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_8px_32px_rgba(255,255,255,0.1)] flex items-center justify-center"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <motion.div
                    className="h-10 w-10 rounded-full border-4 border-white/20 border-t-white"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
                />
            </motion.div>
        </div>
    );

    return (
        <>
            {showIntro ? (
                <IntroAnimation />
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="h-screen w-screen lg:w-full bg-gray-950 text-white p-3 flex flex-col items-center pb-5">
                        <div className="flex flex-col justify-center items-center mb-4 p-5 gap-2 border-b border-gray-800 w-full">
                            <p className="text-2xl font-bold" onClick={() => navigate(`/`)}>
                                JS Exam Time Table
                            </p>
                            <p className="uppercase text-gray-500  text-sm lg:text-md mb-3">
                                Odd Semster examination 2025-2026
                            </p>
                        </div>

                        {/* =================== MODAL =================== */}
                        {showInfo && (
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
                                <div className="relative w-full max-w-sm bg-gray-900 rounded-xl p-5 shadow-lg">
                                    <button
                                        onClick={() => setShowInfo(false)}
                                        className="absolute top-3 right-3 text-xl text-gray-300 hover:text-white"
                                    >
                                        ✕
                                    </button>

                                    {subject ? (
                                        <div className="space-y-4 mt-3">
                                            <p
                                                className={`inline-block px-2 py-1 text-sm rounded ${extra.color} shine-btn`}
                                            >
                                                {extra.phase}
                                            </p>

                                            <div className="text-center space-y-1">
                                                <h1 className="text-xl font-bold">{subject.code}</h1>
                                                <p className="text-gray-300">{subject.name}</p>

                                                <div className="flex justify-center gap-2 text-gray-400 text-lg">
                                                    <p>{subject.Date?.split("-")[2]}</p>
                                                    <p>{monthNames[subject.Date?.split("-")[1] - 1]}</p>
                                                    <p>{subject.Date?.split("-")[0]}</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between text-gray-300">
                                                <div>
                                                    <p>Shift: {subject.shift}</p>
                                                    <p>{subject.paper}</p>
                                                </div>

                                                <div>
                                                    <p>{subject.startTime}</p>
                                                    <p>{subject.endTime}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <h1 className="text-center font-bold text-xl py-20">
                                            Not an Exam Day
                                        </h1>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* =================== MAIN LAYOUT =================== */}
                        <div className="flex flex-col lg:flex-col w-full  lg:w-screen items-center gap-4">
                            <div className="lg:w-[80%] lg:gap-10 bg-gray-900 hover:bg-gray-800 rounded-lg p-4 px-3 flex gap-2 justify-center items-center">
                                <p className="border-r-2 px-2 lg:px-10 border-gray-700">
                                    <span className="font-bold">Course :</span> {courseId}
                                </p>
                                <p className="border-r-2 px-2 border-gray-700 lg:px-10">
                                    <span className="font-bold">Branch :</span> {branchId}
                                </p>
                                <p className="pr-2 lg:px-10">
                                    <span className="font-bold">Semester :</span> {semId}
                                </p>
                            </div>

                            {/* ============ CALENDARS ============ */}
                            <div className="flex gap-2 overflow-x-auto no-scrollbar w-[99.9%] lg:w-[80%]">
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

                            {/* ============ SUBJECT LIST ============ */}
                            <div className="lg:w-[80%] h-90 w-full overflow-y-auto no-scrollbar space-y-2 ">
                                {semester.subjects.map((subject, index) => {
                                    const { days, hours, minutes, seconds, phase, color } =
                                        getRemainingTime(subject);

                                    return (
                                        <div
                                            key={index}
                                            onClick={() => showDetails(subject.code, phase, color)}
                                            className="p-3 bg-gray-900 rounded-lg cursor-pointer hover:bg-gray-800"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.12 }}
                                        >
                                            <div className="flex gap-3">
                                                <div className="flex flex-col items-center border-r border-gray-700 pr-3">
                                                    <p className="text-xl">
                                                        {subject.Date?.split("-")[2]}
                                                    </p>
                                                    <p className="text-gray-400 text-sm">
                                                        {monthNames[subject.Date?.split("-")[1] - 1]}
                                                    </p>
                                                </div>

                                                <div className="flex justify-between w-full">
                                                    <div className="flex flex-col justify-between">
                                                        <p className="font-bold">{subject.name}</p>

                                                        <p className="text-gray-400">
                                                            {days}D : {hours}H : {minutes}M : {seconds}S
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col items-end justify-between">
                                                        <p
                                                            className={`text-sm px-2 py-1 rounded ${color} shine-btn`}
                                                        >
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

                            <div
                                className="w-full lg:w-[80%] bottom-0 left-0 z-50 
                bg-gray-900/20 backdrop-blur-md 
                 
                px-6 py-3 flex items-center justify-center gap-3 rounded-xl mb-5 "
                            >
                                <a
                                    href="/"
                                    className=" border border-gray-900/30 p-1 px-4 rounded-xl text-white font-semibold tracking-wide hover:text-blue-400 transition"
                                >
                                    Home
                                </a>

                                <a
                                    href="/history"
                                    className="  border  border-gray-900/30 p-1 px-4 rounded-xl text-white font-semibold tracking-wide hover:text-blue-400 transition"
                                >
                                    History
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default TimeTable;


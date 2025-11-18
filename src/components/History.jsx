import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const History = () => {
    const storedData = JSON.parse(localStorage.getItem("studentData")) || [];
    const navigate = useNavigate();

    return (
        <div className="h-screen w-screen  bg-gray-950 text-white p-5 flex flex-col items-center">
            <div className="mb-10 mt-5 text-center">
                <h1 className="text-3xl font-bold tracking-wide">History</h1>
                <p className="text-gray-400 text-sm mt-2">
                    Previously accessed exam timetables
                </p>
            </div>

            {/* CONTENT BOX */}
            <div
                className="w-full max-w-2xl 
                     
                      p-2 lg:h-[70vh] h-135 overflow-y-auto no-scrollbar"
            >
                {storedData.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">No history found.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {storedData.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="p-2 rounded-xl bg-gray-800/60 
                           border border-gray-700 hover:bg-gray-800
                           transition cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-lg font-semibold uppercase">
                                            {item.course} / {item.branch} / {item.sem}
                                        </p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            Odd Semester : 2025-26
                                        </p>
                                    </div>

                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        className="text-blue-400 font-semibold"
                                        onClick={() =>
                                            navigate(`/${item.course}/${item.branch}/${item.sem}`)
                                        }
                                    >
                                        View →
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* footer */}

            <div
                className="w-full lg:max-w-2xl bottom-0 left-0 z-50 mt-5 rounded-lg
                bg-gray-900/50 backdrop-blur-md  
                px-6 py-3 flex items-center justify-center gap-3 border border-gray-900"
            >
                <a
                    href="/"
                    className="text-white font-semibold tracking-wide hover:text-blue-400 transition border border-gray-900/30 p-1 px-4 rounded-xl"
                >
                    Home
                </a>

                <a
                    href="/history"
                    className=" border border-gray-900/30 p-1 px-4 rounded-xl text-white font-semibold tracking-wide hover:text-blue-400 transition"
                >
                    History
                </a>
            </div>
        </div>
    );
};

export default History;

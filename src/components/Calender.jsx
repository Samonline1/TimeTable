import React from "react";

import "./Calender.css";

const Calendar = ({ year, month, examDate, CalDate }) => {

    const today = new Date();
    today.setHours(0, 0, 0, 0); // for past exams 

    const date = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = date.getDay(); // 0 (Sun) - 6 (Sat)
    const days = [];
    // console.log(days);

    // console.log("Date", date, "DaysInMonth", daysInMonth, "firstDay", firstDay);

    // console.log(days);
    // console.log(examDate.map((e, index) => index)); index

    // console.log(examDate[0].split('-')[0]); // date number

    // console.log(examDate.length); // array number

    // const ExamDates = examDate.filter(e => e === examDate[0])
    // console.log(ExamDates);

    //checks year and month

    const safeExamDate = Array.isArray(examDate) ? examDate : [];

    // console.log(safeExamDate);
    

    const examDays = safeExamDate
        .filter((d) => {
            const [y, m] = d.split("-").map(Number);
            return y === year && m === month;
        })
        .map((d) => Number(d.split("-")[2])); // get the date number

    // console.log("examDays:", examDays.length);

    // Add blank spaces before the first day - like in calender
    for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
        days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    // Add days
    for (let i = 1; i <= daysInMonth; i++) {
        const isExamDay = examDays.includes(i);
        // console.log(isExamDay);

        const currentDate = new Date(year, month - 1, i);
        currentDate.setHours(0, 0, 0, 0);

        // If exam date in past 
        let bgColor = "";
        if (isExamDay) {
            if (currentDate < today) {
                bgColor = "#dc2626";
            } else {
                bgColor = "#16a34a";
            }
        }


        days.push(
            <div key={i} className="day"
                //className={`day ${isExamDay ? "exam-day" : ""}`}
                style={{ backgroundColor: bgColor }}
                onClick={() => CalDate(i)}

            >
                {i}
            </div>
        );
    }

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

    // const okio = (d)=> {
    //     console.log(d);

    // }

    return (
        <div className="calendar">
            <h2 className="title pb-2"> {monthNames[month - 1]} {year}</h2>
            <p className="subtitle">
                {examDays.length} Exams in {monthNames[month - 1]}
            </p> 
            <div className="weekdays">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <div key={d} className="weekday">
                        {d}
                    </div>
                ))}
            </div>
            <div

                className="days-grid">{days}</div>
        </div>
    );
};

export default Calendar;

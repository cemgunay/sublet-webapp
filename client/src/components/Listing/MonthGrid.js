import React, { useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./MonthGrid.css";

const months = [
  "September",
  "October",
  "November",
  "December",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
];

const MonthGrid = ({ moveInDate, moveOutDate, shorterStays, onDataChange }) => {
  const [schoolYear, setSchoolYear] = useState({ start: 2022, end: 2023 });
  const [animationDirection, setAnimationDirection] = useState("forward");
  const [key, setKey] = useState(0);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const startDate = new Date(moveInDate);
    const endDate = new Date(moveOutDate);
    const selected = [];

    while (startDate <= endDate) {
      const month =
        months[
          startDate.getMonth() < 8
            ? startDate.getMonth() + 4
            : startDate.getMonth() - 8
        ];
      const year = startDate.getFullYear();
      const schoolYearStart = year - (startDate.getMonth() < 8 ? 1 : 0);
      const monthYear = `${month}-${schoolYearStart}-${schoolYearStart + 1}`;

      selected.push({
        id: monthYear,
        month,
        schoolYear: { start: schoolYearStart, end: schoolYearStart + 1 },
      });
      startDate.setMonth(startDate.getMonth() + 1);
    }

    setSelectedMonths(selected);
  }, [moveInDate, moveOutDate]);

  const sortSelectedMonths = (monthsArray) => {
    return monthsArray.sort((a, b) => {
      const aIndex = months.indexOf(a.month);
      const bIndex = months.indexOf(b.month);
      if (a.schoolYear.start === b.schoolYear.start) {
        return aIndex - bIndex;
      }
      return a.schoolYear.start - b.schoolYear.start;
    });
  };

  const toggleMonth = (month, index) => {
    if (!shorterStays) return;

    const monthYear = `${month}-${schoolYear.start}-${schoolYear.end}`;
    const selectedIndex = selectedMonths.findIndex((m) => m.id === monthYear);

    console.log(selectedIndex);

    if (selectedIndex !== -1) {
      // If the selected month is at the beginning or end of the range, unselect it
      if (selectedIndex === 0 || selectedIndex === selectedMonths.length - 1) {
        setSelectedMonths((prevSelectedMonths) => {
          const updatedSelectedMonths = prevSelectedMonths.filter(
            (m) => m.id !== monthYear
          );
          return sortSelectedMonths(updatedSelectedMonths);
        });
      }
    } else {
      // If there are no selected months, or the clicked month is adjacent to the existing range, select it
      if (index === 0) {
        const prevIndex = selectedMonths.findIndex(
          (m) => m.month === months[11]
        );
        const nextIndex = selectedMonths.findIndex(
          (m) => m.month === months[1]
        );

        if (
          selectedMonths.length === 0 ||
          prevIndex !== -1 ||
          nextIndex !== -1
        ) {
          setSelectedMonths((prevSelectedMonths) => {
            const updatedSelectedMonths = [
              ...prevSelectedMonths,
              { id: monthYear, month, schoolYear },
            ];
            return sortSelectedMonths(updatedSelectedMonths);
          });
        }
      }

      const prevIndex = selectedMonths.findIndex(
        (m) => m.month === months[index - 1]
      );
      const nextIndex = selectedMonths.findIndex(
        (m) => m.month === months[index + 1]
      );

      if (selectedMonths.length === 0 || prevIndex !== -1 || nextIndex !== -1) {
        setSelectedMonths((prevSelectedMonths) => {
          const updatedSelectedMonths = [
            ...prevSelectedMonths,
            { id: monthYear, month, schoolYear },
          ];
          return sortSelectedMonths(updatedSelectedMonths);
        });
      }
    }
  };

  const changeSchoolYear = (increment) => {
    setAnimationDirection(increment > 0 ? "forward" : "backward");
    setSchoolYear((prev) => ({
      start: prev.start + increment,
      end: prev.end + increment,
    }));
  };

  useEffect(() => {
    setKey((prevKey) => prevKey + 1);
  }, [schoolYear]);

  const isSelected = (month) => {
    const monthYear = `${month}-${schoolYear.start}-${schoolYear.end}`;
    return selectedMonths.findIndex((m) => m.id === monthYear) !== -1;
  };

  useEffect(() => {
    if (selectedMonths.length > 0) {
      const firstMonth = selectedMonths[0];
      const lastMonth = selectedMonths[selectedMonths.length - 1];
      const firstMonthIndex = months.indexOf(firstMonth.month);
      const lastMonthIndex = months.indexOf(lastMonth.month);

      if (firstMonthIndex > 3) {
        setStartDate(
          new Date(
            firstMonth.schoolYear.end,
            firstMonthIndex - 4,
            1
          ).toISOString()
        );
      } else {
        setStartDate(
          new Date(
            firstMonth.schoolYear.start,
            firstMonthIndex + 8,
            1
          ).toISOString()
        );
      }

      if (lastMonthIndex > 3) {
        setEndDate(
          new Date(
            lastMonth.schoolYear.end,
            lastMonthIndex - 3,
            0
          ).toISOString()
        );
      } else {
        setEndDate(
          new Date(
            lastMonth.schoolYear.start,
            lastMonthIndex + 9,
            0
          ).toISOString()
        );
      }
    }
  }, [selectedMonths]);

  useEffect(() => {
    if (startDate && endDate) {
      onDataChange({ startDate, endDate });
    }
  }, [startDate, endDate, onDataChange]);

  return (
    <div className="month-grid-wrapper">
      <div className="school-year">
        <button onClick={() => changeSchoolYear(-1)}>&larr;</button>
        <span>
          {schoolYear.start}-{schoolYear.end}
        </span>
        <button onClick={() => changeSchoolYear(1)}>&rarr;</button>
      </div>
      <div className="month-grid-container">
        <TransitionGroup component={null}>
          <CSSTransition
            key={key}
            classNames={`slide-${animationDirection}`}
            timeout={300}
          >
            <div className="month-grid">
              {months.map((month, index) => (
                <div
                  key={month}
                  className={`month-rectangle${
                    isSelected(month) ? " selected" : ""
                  }`}
                  onClick={() => toggleMonth(month, index)} // Pass the index here
                >
                  {month}
                </div>
              ))}
            </div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </div>
  );
};

export default MonthGrid;

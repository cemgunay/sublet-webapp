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

const MonthGrid = ({
  moveInDate,
  moveOutDate,
  shorterStays,
  onDataChange,
  defaultMoveInDate,
  defaultMoveOutDate
}) => {
  const [animationDirection, setAnimationDirection] = useState("forward");
  const [key, setKey] = useState(0);

  const [selectedMonths, setSelectedMonths] = useState([]);

  const [startDate, setStartDate] = useState(moveInDate);
  const [endDate, setEndDate] = useState(moveOutDate);
  const [userHasChangedDates, setUserHasChangedDates] = useState(false);

  const getDefaultSchoolYear = () => {
    
    
    if (!moveInDate || !moveOutDate) {
      const currentYear = new Date().getFullYear();
      return { start: currentYear, end: currentYear + 1 };
    }

    const endDate = new Date(moveOutDate);
    const schoolYearStart =
      endDate.getMonth() < 8
        ? endDate.getFullYear() - 1
        : endDate.getFullYear();
    const schoolYearEnd = schoolYearStart + 1;
    return { start: schoolYearStart, end: schoolYearEnd };
  };

  const [schoolYear, setSchoolYear] = useState(getDefaultSchoolYear());

  useEffect(() => {
    setSchoolYear(getDefaultSchoolYear());
  }, [moveInDate, moveOutDate]);

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

  const toggleMonth = (month, index, schoolYear) => {
    if (!shorterStays) return;

    const monthYear = `${month}-${schoolYear.start}-${schoolYear.end}`;
    const selectedIndex = selectedMonths.findIndex((m) => m.id === monthYear);

    //for debugging styll
    /*
    console.log(monthYear)
    console.log(selectedIndex)
    console.log(index)
    console.log(selectedMonths)
    */

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
          (m) =>
            m.month === months[11] &&
            m.schoolYear.start === schoolYear.start - 1 &&
            m.schoolYear.end === schoolYear.end - 1
        );

        const nextIndex = selectedMonths.findIndex(
          (m) =>
            m.month === months[1] &&
            m.schoolYear.start === schoolYear.start &&
            m.schoolYear.end === schoolYear.end
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
      } else if (index === 11) {
        const prevIndex = selectedMonths.findIndex(
          (m) =>
            m.month === months[11] &&
            m.schoolYear.start === schoolYear.start &&
            m.schoolYear.end === schoolYear.end
        );

        const nextIndex = selectedMonths.findIndex(
          (m) =>
            m.month === months[1] &&
            m.schoolYear.start === schoolYear.start + 1 &&
            m.schoolYear.end === schoolYear.end + 1
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
        (m) =>
          m.month === months[index - 1] &&
          m.schoolYear.start === schoolYear.start &&
          m.schoolYear.end === schoolYear.end
      );

      const nextIndex = selectedMonths.findIndex(
        (m) =>
          m.month === months[index + 1] &&
          m.schoolYear.start === schoolYear.start &&
          m.schoolYear.end === schoolYear.end
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
    setUserHasChangedDates(true);
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
      //logic for help with move in dates
      const firstMonth = selectedMonths[0];
      const lastMonth = selectedMonths[selectedMonths.length - 1];
      const firstMonthIndex = months.indexOf(firstMonth.month);
      const lastMonthIndex = months.indexOf(lastMonth.month);

      const defaultStart = new Date(defaultMoveInDate);
      const defaultEnd = new Date(defaultMoveOutDate);
      const defaultStartMonthIndex = (defaultStart.getMonth() - 8 + 12) % 12;
      const defaultEndMonthIndex = (defaultEnd.getMonth() - 8 + 12) % 12;

      //for debugging styll
      /*
      console.log(defaultStart)
      console.log(defaultStartMonthIndex)
      console.log(defaultStart.getFullYear())
      console.log(firstMonth)
      console.log(firstMonthIndex)
      console.log(firstMonth.schoolYear.end)
      */

      if (firstMonthIndex === defaultStartMonthIndex) {
        if (
          firstMonthIndex > 3 &&
          firstMonth.schoolYear.end === defaultStart.getFullYear()
        ) {
          setStartDate(defaultMoveInDate);
        } else if (
          firstMonthIndex < 4 &&
          firstMonth.schoolYear.start === defaultStart.getFullYear()
        ) {
          setStartDate(defaultMoveInDate);
        }

        if (lastMonthIndex === defaultEndMonthIndex) {
          if (
            lastMonthIndex > 3 &&
            lastMonth.schoolYear.end === defaultStart.getFullYear()
          ) {
            setEndDate(defaultMoveOutDate);
          } else if (
            lastMonthIndex < 4 &&
            lastMonth.schoolYear.start === defaultStart.getFullYear()
          ) {
            setEndDate(defaultMoveOutDate);
          }
        } else {
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
      } else if (lastMonthIndex === defaultEndMonthIndex) {
        if (
          lastMonthIndex > 3 &&
          lastMonth.schoolYear.end === defaultStart.getFullYear()
        ) {
          setEndDate(defaultMoveOutDate);
        } else if (
          lastMonthIndex < 4 &&
          lastMonth.schoolYear.start === defaultStart.getFullYear()
        ) {
          setEndDate(defaultMoveOutDate);
        }

        if (firstMonthIndex === defaultStartMonthIndex) {
          if (
            firstMonthIndex > 3 &&
            firstMonth.schoolYear.end === defaultStart.getFullYear()
          ) {
            setStartDate(defaultMoveInDate);
          } else if (
            firstMonthIndex < 4 &&
            firstMonth.schoolYear.start === defaultStart.getFullYear()
          ) {
            setStartDate(defaultMoveInDate);
          }
        } else {
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
        }
      } else {
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
    }
  }, [selectedMonths, defaultMoveInDate, defaultMoveOutDate]);

  useEffect(() => {
    if (startDate && endDate && userHasChangedDates) {
      onDataChange({ startDate, endDate });
    }
  }, [startDate, endDate, onDataChange, userHasChangedDates]);

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
        <div className="month-grid">
          {months.map((month, index) => (
            <div
              key={month}
              className={`month-rectangle${
                isSelected(month) ? " selected" : ""
              }`}
              onClick={() => toggleMonth(month, index, schoolYear)} // Pass the index here
            >
              {month}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MonthGrid;

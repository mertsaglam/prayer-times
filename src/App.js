import React, { useState } from "react";
import { URL_WITH_CITY } from "./Api";
import "./App.css";
import Search from "./Search.js/Search";
import { useEffect } from "react";

const calculateSunPosition = (currentTime, lightAmount) => {
  const angle = (currentTime / lightAmount) * 180;
  const x = 150 * Math.cos((Math.PI / 180) * angle);
  const y = 150 * Math.sin((Math.PI / 180) * angle);
  return { x: -x, y }; // Negate the x-coordinate
};

const calculateTimeLabelPosition = (
  timeInMinutes,
  lightAmount,
  index,
  radius
) => {
  const angle = (timeInMinutes / lightAmount) * 180;
  let x = radius * Math.cos((Math.PI / 180) * angle);
  if (index < 3) {
    x = x;
  }
  if (index > 3) {
    x = x;
  }

  const y = radius * Math.sin((Math.PI / 180) * angle);
  return { x: -x, y }; // Negate the x-coordinate
};

function App() {
  const [currentTimes, setCurrentTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentMinutes, setCurrentMinutes] = useState([]);
  const [lightAmount, setLightAmount] = useState(0);
  const [time, setTime] = useState(0);
  const timeNames = ["İmsak", "Güneş", "Öğle", "İkindi", "Akşam", "Yatsı"];
  const [currentClockTime, setCurrentClockTime] = useState("");

  useEffect(() => {
    // Function to update the time displayed by the clock
    const updateClockAndSun = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      setCurrentClockTime(`${hours}:${minutes}:${seconds}`);

      // Update sun position
      const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
      const normalizedTime = currentTimeInMinutes - currentMinutes[1];
      setTime(normalizedTime);
    };

    // Update the clock and sun position immediately
    updateClockAndSun();

    // Set an interval to update the clock and sun position every second
    const interval = setInterval(updateClockAndSun, 1000);

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [currentMinutes]); // Dependency array includes currentMinutes

  const timesToMins = (times) => {
    const [hours, minutes] = times.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleOnSearchChange = (searchData,selectedDate) => {
    setIsLoading(true);
    setError(null);
    const [lat, lng, label,date] = [
      searchData.value.latitude,
      searchData.value.longitude,
      searchData.label,
      selectedDate,
    ];


    fetch(`${URL_WITH_CITY}&region=${label}&city=${label}&date=${date}`)
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        const firstDate = Object.keys(data.times)[0];
        const timesArray = data.times[firstDate];
        setCurrentTimes(timesArray);
        const timesInMinutes = timesArray.map(timesToMins);
        setCurrentMinutes(timesInMinutes);
        setLightAmount(timesInMinutes[4] - timesInMinutes[1]);

        // Get current time in minutes
        const currentTime = new Date();
        console.log(currentTime);
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        var currentTimeInMinutes = currentHour * 60 + currentMinute;
        currentTimeInMinutes = currentTimeInMinutes - timesInMinutes[1];
        setTime(currentTimeInMinutes);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.toString());
      });
  };

  return (
    <div className="App">
      <Search onSearchChange={handleOnSearchChange} />
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          {currentTimes.length === 0 ? (
            <li>No times available</li>
          ) : (
            currentTimes.map((time, index) => (
              <li key={index}>
                {time} {timeNames[index]}
              </li>
            ))
          )}
          <div className="clock">Current time: {currentClockTime}</div>

          <div className="arc">
            {lightAmount && time ? (
              <span
                className="sun"
                style={{
                  left: `calc(50% + ${
                    calculateSunPosition(time, lightAmount).x
                  }px)`,
                  bottom: `${calculateSunPosition(time, lightAmount).y}px`,
                }}
              >
                🌞
              </span>
            ) : null}

            {currentMinutes.length > 0 &&
              currentMinutes.map((timeInMinutes, index) => {
                // For the dot
                const { x: dotX, y: dotY } = calculateTimeLabelPosition(
                  timeInMinutes - currentMinutes[1],
                  lightAmount,
                  index,
                  150
                );

                // For the label, using a larger radius (e.g., 175)
                const { x: labelX, y: labelY } = calculateTimeLabelPosition(
                  timeInMinutes - currentMinutes[1],
                  lightAmount,
                  index,
                  190
                );

                return (
                  <>
                    {/* Dot */}
                    <span
                      key={`dot-${index}`}
                      className="dot"
                      style={{
                        left: `calc(50% + ${dotX}px - 5px)`, // Offset by half dot size
                        bottom: `${dotY - 5}px`, // Offset by half dot size
                      }}
                    ></span>

                    {/* Time Label */}
                    <span
                      key={`label-${index}`}
                      className="time-label"
                      style={{
                        left: `calc(50% + ${labelX}px)`,
                        bottom: `${labelY}px`,
                      }}
                    >
                      {`${timeNames[index]}: ${currentTimes[index]}`}
                    </span>
                  </>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

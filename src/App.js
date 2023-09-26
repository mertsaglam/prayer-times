import React, { useState } from "react";
import { URL_WITH_CITY } from "./Api";
import "./App.css";
import Search from "./Search.js/Search";
import { useEffect } from "react";
import {
  calculateSunPosition,
  calculateTimeLabelPosition,
} from "./utils/Utils";
import ClockComponent from "./Clock/ClockComponent.js";
import PrayerTimesList from "./PrayerTimes/PrayerTimesList";
import Popup from "./Popup/Popup";

function App() {
  const [currentTimes, setCurrentTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentMinutes, setCurrentMinutes] = useState([]);
  const [lightAmount, setLightAmount] = useState(0);
  const [time, setTime] = useState(0);
  const timeNames = ["İmsak", "Güneş", "Öğle", "İkindi", "Akşam", "Yatsı"];
  const [currentClockTime, setCurrentClockTime] = useState("");
  const [compareTime, setCompareTime] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [popupTimeName, setPopupTimeName] = useState("");

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
    let show = false;
    let timeName = "";
    currentMinutes.forEach((timeInMinutes, index) => {
      const diff = timeInMinutes - compareTime;

      if (diff <= 30 && diff >= 0) {
        show = true;
        timeName = timeNames[index];
      } else {
        show = false;
      }
    });

    setShowPopup(show);
    setPopupTimeName(timeName);
  };

  useEffect(() => {
    // Function to update the time displayed by the clock

    // Update the clock and sun position immediately
    updateClockAndSun();

    // Set an interval to update the clock and sun position every second
    const interval = setInterval(updateClockAndSun, 1000);

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [currentMinutes]); // Dependency array includes currentMinutes
  const initialFetchPrayerTimes = (latitude, longitude, date) => {
    setIsLoading(true);
    setError(null);

    const apiUrl = `https://namaz-vakti.vercel.app/api/timesFromCoordinates?lat=${latitude}&lng=${longitude}&date=${date}&days=3&timezoneOffset=180&calculationMethod=Turkey`;

    fetch(apiUrl)
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
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        setCompareTime(currentTimeInMinutes);
        setTime(currentTimeInMinutes - timesInMinutes[1]);
      })
      .catch((err) => {
        setIsLoading(false);
        setError(err.toString());
      });
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const date = new Date().toISOString().split("T")[0];
          initialFetchPrayerTimes(latitude, longitude, date);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation not available in this browser");
    }
  }, []);
  const timesToMins = (times) => {
    const [hours, minutes] = times.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleOnSearchChange = (searchData, selectedDate) => {
    setIsLoading(true);
    setError(null);
    const [label, date] = [searchData.label, selectedDate];

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

        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        const currentMinute = currentTime.getMinutes();
        var currentTimeInMinutes = currentHour * 60 + currentMinute;
        setCompareTime(currentTimeInMinutes);
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
          <ClockComponent currentClockTime={currentClockTime} />

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
                {compareTime > currentMinutes[4] ||
                compareTime < currentMinutes[1]
                  ? "🌙"
                  : "🌞"}
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
                  <div>
                    <span
                      key={`dot-${index}`}
                      className="dot"
                      style={{
                        left: `calc(50% + ${dotX}px - 5px)`,
                        bottom: `${dotY - 5}px`,
                      }}
                    ></span>

                    <span
                      key={`label-${index}`}
                      className="time-label"
                      style={{
                        left: `calc(50% + ${labelX - 5}px)`,
                        bottom: `${labelY - 35}px`,
                      }}
                    >
                      {`${timeNames[index]}: ${currentTimes[index]}`}
                    </span>
                  </div>
                );
              })}
          </div>
          <div className="night-arc"></div>
        </div>
      )}
      <Popup popupTimeName={popupTimeName} showPopup={showPopup} />
    </div>
  );
}
export default App;

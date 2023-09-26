import {
  
  calculateSunPosition,
} from "../utils/Utils";

function SunPosition({ time, lightAmount, compareTime, currentMinutes }) {
  return (
    <div className="arc">
      {lightAmount && time ? (
        <span
          className="sun"
          style={{
            left: `calc(50% + ${calculateSunPosition(time, lightAmount).x}px)`,
            bottom: `${calculateSunPosition(time, lightAmount).y}px`,
          }}
        >
          {compareTime > currentMinutes[4] || compareTime < currentMinutes[1]
            ? "🌙"
            : "🌞"}
        </span>
      ) : null}
    </div>
  );
}
export default SunPosition;

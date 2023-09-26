import { calculateTimeLabelPosition,calculateSunPosition } from "../utils/Utils";

function TimeLabelsArc({
  currentMinutes,
  timeNames,
  currentTimes,
  lightAmount,
}) {
  return (
    <div className="arc">
      {currentMinutes.map((timeInMinutes, index) => {
        const { x: dotX, y: dotY } = calculateTimeLabelPosition(
          timeInMinutes - currentMinutes[1],
          lightAmount,
          index,
          150
        );

        const { x: labelX, y: labelY } = calculateTimeLabelPosition(
          timeInMinutes - currentMinutes[1],
          lightAmount,
          index,
          190
        );

        return (
          <div key={index}>
            <span
              className="dot"
              style={{
                left: `calc(50% + ${dotX}px - 5px)`,
                bottom: `${dotY - 5}px`,
              }}
            ></span>

            <span
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
  );
}
export default TimeLabelsArc;
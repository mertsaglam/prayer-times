function PrayerTimesList({ currentTimes, timeNames }) {
  return (
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
    </div>
  );
}
export default PrayerTimesList;
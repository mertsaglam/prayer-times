export const calculateSunPosition = (currentTime, lightAmount) => {
  const angle = (currentTime / lightAmount) * 180;
  const x = 150 * Math.cos((Math.PI / 180) * angle);
  const y = 150 * Math.sin((Math.PI / 180) * angle);
  return { x: -x, y }; 
};

export const calculateTimeLabelPosition = (
  timeInMinutes,
  lightAmount,
  index,
  radius
) => {
  const angle = (timeInMinutes / lightAmount) * 180;
  let x = radius * Math.cos((Math.PI / 180) * angle);

  // These conditions appear redundant as x is assigned to itself.
  // You might want to review this logic.
  if (index < 3) {
    x = x;
  }
  if (index > 3) {
    x = x;
  }

  const y = radius * Math.sin((Math.PI / 180) * angle);
  return { x: -x, y }; // Negate the x-coordinate
};

export const timesToMins = (times) => {
  const [hours, minutes] = times.split(":").map(Number);
  return hours * 60 + minutes;
};



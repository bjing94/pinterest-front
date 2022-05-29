export default function convertAgeToString(start: Date, end: Date) {
  const milliseconds = end.getTime() - start.getTime();
  const toMinutes = 1 / (1000 * 60);
  const toHours = 1 / (1000 * 60 * 60);
  const toDays = 1 / (1000 * 60 * 60 * 24);
  const toMonths = 1 / (1000 * 60 * 60 * 24 * 7);
  const toYears = 1 / (1000 * 60 * 60 * 24 * 7 * 365);
  if (Math.floor(milliseconds * toMinutes) < 1) {
    return `Just now`;
  }
  if (Math.floor(milliseconds * toMinutes) < 60) {
    return `${Math.floor(milliseconds * toMinutes)} minutes`;
  }
  if (Math.floor(milliseconds * toHours) < 24) {
    return `${Math.floor(milliseconds * toHours)} hours`;
  }

  if (Math.floor(milliseconds * toDays) < 7) {
    return `${Math.floor(milliseconds * toDays)} days`;
  }

  if (Math.floor(milliseconds * toMonths) < 12) {
    return `${Math.floor(milliseconds * toMonths)} months`;
  }

  return `${Math.floor(milliseconds * toYears)} years`;
}

/**
 * @example
 * console.log(timeStringToSeconds('15d')); // 1296000 seconds (15 days)
 * @param timeString A string representing a time interval
 * @returns The number of seconds in the time interval
 */
export function timeStringToSeconds(timeString: string) {
  const matches = timeString.match(/(\d+)\s*([dhms])/g);
  if (!matches) {
    throw new Error('Invalid time string format');
  }

  let totalSeconds = 0;
  matches.forEach((match) => {
    const value = parseInt(match.match(/\d+/)[0]);
    const unit = match.match(/[dhms]/)[0];
    switch (unit) {
      case 'd':
        totalSeconds += value * 24 * 60 * 60; // Days to seconds
        break;
      case 'h':
        totalSeconds += value * 60 * 60; // Hours to seconds
        break;
      case 'm':
        totalSeconds += value * 60; // Minutes to seconds
        break;
      case 's':
        totalSeconds += value; // Seconds
        break;
      default:
        throw new Error('Invalid time unit');
    }
  });

  return totalSeconds;
}

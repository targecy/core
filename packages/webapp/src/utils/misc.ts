const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const weekdayToNumber = (weekday: number) => {
  if (weekday < 0 || weekday > 6) throw new Error('Invalid weekday');
  return weekdays[weekday];
};

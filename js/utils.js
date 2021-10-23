const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const daysPassed = (date - firstDayOfYear) / 86400000;
  const firstDayOfYearDayOfWeek = firstDayOfYear.getDay() + 1;

  return Math.ceil((daysPassed + firstDayOfYearDayOfWeek) / 7);
};

const isLeapYear = (year) => {
  if (year % 4 !== 0) return false;
  if (year % 100 === 0 && year % 400 !== 0) return false;
  if ((year % 100 === 0 && year % 400 === 0) || year % 100 !== 0) return true;
};

export { getWeekNumber, isLeapYear };

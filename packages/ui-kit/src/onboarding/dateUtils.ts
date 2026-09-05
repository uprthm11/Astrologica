/**
 * Calendar and leap year mathematics for birth date validation.
 */

export function isLeapYear(year: number): boolean {
  if (year <= 0) return false;
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export function getDaysInMonth(year: number, month: number): number {
  if (month < 1 || month > 12) return 31;
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if ([4, 6, 9, 11].includes(month)) {
    return 30;
  }
  return 31;
}

export function isValidDate(year: number, month: number, day: number): boolean {
  if (year < 1800 || year > 2100) return false;
  if (month < 1 || month > 12) return false;
  const maxDays = getDaysInMonth(year, month);
  return day >= 1 && day <= maxDays;
}

export function isValidTime(hours: number, minutes: number): boolean {
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

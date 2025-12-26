import * as moment from 'moment-timezone';

export const DB_DATE = 'YYYY-MM-DD';
export const DB_DATE_TIME = 'YYYY-MM-DD HH:mm:ss';

export const formatD = (date: Date, format: string): string => {
  try {
    if (!date) return '';
    return moment.utc(date).format(format).toUpperCase();
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const formatDT = (
  date: Date,
  format: string,
  timeZoneIdentifier: string,
): string => {
  try {
    if (!date) return '';
    if (timeZoneIdentifier) {
      return moment
        .utc(date)
        .tz(timeZoneIdentifier)
        .format(format)
        .toUpperCase();
    } else {
      return moment.utc(date).format(format).toUpperCase();
    }
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const formatReadDateTime = (date: Date) => {
  if (date != null && date != undefined) {
    return moment(date).format('DD MMM YYYY hh:mm:ss a').toUpperCase();
  } else {
    return '';
  }
};

export const formatReadDate = (date: Date) => {
  if (date != null && date != undefined) {
    return moment(date).format('DD MMM YYYY').toUpperCase();
  } else {
    return '';
  }
};

export const formatDBDateTime = (date: Date) => {
  if (date != null && date != undefined) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss').toUpperCase();
  } else {
    return '';
  }
};

export const formatDBDateTimeUTC = (date: Date) => {
  return moment.utc(date).format('YYYY-MM-DD HH:mm:ss').toUpperCase();
};

export const formatDBDate = (date: Date) => {
  if (date != null && date != undefined) {
    return moment(date).format('YYYY-MM-DD').toUpperCase();
  } else {
    return '';
  }
};

export const formatDBYearMonth = (date: Date) => {
  if (date != null && date != undefined) {
    return moment(date).format('YYYY-MM').toUpperCase();
  } else {
    return '';
  }
};

export const formatMonthAndYear = (date: Date) => {
  if (date != null && date != undefined) {
    return moment(date).format('MMM-YYYY').toUpperCase();
  } else {
    return '';
  }
};

export const formatReadDateTime_FS = (date_string: string) => {
  const date = stringToDate(date_string);
  if (date != null && date != undefined) {
    return moment(date).format('DD MMM YYYY hh:mm:ss a').toUpperCase();
  } else {
    return '';
  }
};

export const formatReadDate_FS = (date_string: string) => {
  const date = stringToDate(date_string);
  if (date != null && date != undefined) {
    return moment(date).format('DD MMM YYYY').toUpperCase();
  } else {
    return '';
  }
};

export const formatDBDateTime_FS = (date_string: string) => {
  const date = stringToDate(date_string);
  if (date != null && date != undefined) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss').toUpperCase();
  } else {
    return '';
  }
};

export const formatDBDate_FS = (date_string: string) => {
  const date = stringToDate(date_string);
  if (date != null && date != undefined) {
    return moment(date).format('YYYY-MM-DD').toUpperCase();
  } else {
    return '';
  }
};

export const formatMonthAndYear_FS = (date_string: string) => {
  const date = stringToDate(date_string);
  if (date != null && date != undefined) {
    return moment(date).format('MMM-YYYY').toUpperCase();
  } else {
    return '';
  }
};

// Additional
export const formatYearAndMonth = (date: Date) => {
  if (date != null && date != undefined) {
    return moment(date).format('YYYY_MM_MMM').toUpperCase();
  } else {
    return '';
  }
};

export const stringToDate = (date_string: string) => {
  if (date_string != null && date_string != undefined) {
    return new Date(date_string);
  } else {
    return null;
  }
};

export const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0');
};

export const convertSecondsTo_HH_MM_SS = (seconds: number): string => {
  try {
    if (seconds === null || seconds === undefined || isNaN(seconds)) {
      return '';
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const hourString = hours > 9 ? `${hours}` : `0${hours}`;
    const minuteString = minutes > 9 ? `${minutes}` : `0${minutes}`;
    const secondString =
      remainingSeconds > 9 ? `${remainingSeconds}` : `0${remainingSeconds}`;

    return `${hourString}:${minuteString}:${secondString}`;
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const convertSecondsTo_DD_HH_MM_SS = (seconds: number): string => {
  try {
    if (
      seconds === null ||
      seconds === undefined ||
      isNaN(seconds) ||
      seconds == 0
    ) {
      return '';
    }

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const dayString = days > 9 ? `${days}` : `0${days}`;
    const hourString = hours > 9 ? `${hours}` : `0${hours}`;
    const minuteString = minutes > 9 ? `${minutes}` : `0${minutes}`;
    const secondString =
      remainingSeconds > 9 ? `${remainingSeconds}` : `0${remainingSeconds}`;

    if (days > 0) {
      return `${dayString}:${hourString}:${minuteString}:${secondString}`;
    } else {
      return `${hourString}:${minuteString}:${secondString}`;
    }
  } catch (error) {
    console.log(error);
    return '';
  }
};

export const get_seconds_FS = (date_string: string): number => {
  return Math.floor(new Date(date_string).getTime() / 1000);
};

export const get_seconds_FS_in_utc_0 = (
  date_string: string,
  offset_seconds: number,
): number => {
  return Math.floor(new Date(date_string).getTime() / 1000) - offset_seconds;
};

// Start of week (Sunday)
export const getStartOfWeek = (date: Date): Date => {
  const day = date.getDay(); // Sunday = 0
  const diff = -day; // Backtrack to Sunday
  const start = new Date(date);
  start.setDate(date.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
};

// Start of month
export const getStartOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
};

// Subtract days
export const subDays = (date: Date, days: number): Date => {
  return new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
};

// Subtract months
export const subMonths = (date: Date, months: number): Date => {
  const newDate = new Date(date);
  newDate.setMonth(newDate.getMonth() - months);
  return newDate;
};

// Start of day
export const getStartOfDay = (date: Date): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0,
  );
};

// End of day
export const getEndOfDay = (date: Date): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
};

// 🕒 Utility to add two "HH:MM:SS" time strings
export const addTime = (t1: string, t2: string): string => {
  try {
    if (!t1 || !t2) return '';

    const [h1, m1, s1] = t1.split(':').map(Number);
    const [h2, m2, s2] = t2.split(':').map(Number);

    const totalSeconds = h1 * 3600 + m1 * 60 + s1 + h2 * 3600 + m2 * 60 + s2;
    return convertSecondsTo_HH_MM_SS(totalSeconds);
  } catch (error) {
    console.log('addTime error:', error);
    return '';
  }
};

import { BadRequestException } from '@nestjs/common';

export const generateRandomNumber = () => {
  const min = 100000;
  const max = 999999;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

export const leadingNullString = (value: string | number, minSize: number) => {
  if (typeof value == 'number') {
    value = '' + value;
  }
  let outString = '';
  const counter = minSize - value.length;
  if (counter > 0) {
    for (let i = 0; i < counter; i++) {
      outString += '0';
    }
  }
  return outString + value;
};

export const removeLeadingZeros = (result) => {
  while (result[0] === '0') {
    result = result.substring(1);
  }
  return result;
};

export const isValidUUID = (id: string): boolean => {
  if (typeof id !== 'string' || id.trim().length === 0) {
    return false;
  }
  const uuidV4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidV4Regex.test(id.trim());
};

export const isValidMongoId = (id: string): boolean => {
  if (typeof id !== 'string' || id.trim().length === 0) {
    return false;
  }
  const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
  return mongoIdRegex.test(id.trim());
};

export function validateUUID(id: string) {
  if (!isValidUUID(id)) {
    throw new BadRequestException('Invalid UUID format');
  }
}

export const round_2 = (value: number | null | undefined): number => {
  if (typeof value !== 'number' || isNaN(value)) {
    return 0;
  }
  return parseFloat(value.toFixed(2));
};

export const round_4 = (value: number | null | undefined): number | null => {
  if (typeof value !== 'number' || isNaN(value)) {
    return null;
  }
  return parseFloat(value.toFixed(4));
};

export const round_6 = (value: number | null | undefined): number | null => {
  if (typeof value !== 'number' || isNaN(value)) {
    return null;
  }
  return parseFloat(value.toFixed(6));
};

export const round_8 = (value: number | null | undefined): number | null => {
  if (typeof value !== 'number' || isNaN(value)) {
    return null;
  }
  return parseFloat(value.toFixed(8));
};

export const distance_km = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

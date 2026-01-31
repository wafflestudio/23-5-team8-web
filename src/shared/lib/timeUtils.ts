interface TimeSlot {
  day: string;
  startMinutes: number;
  endMinutes: number;
}

/**
 * Parse time string like "월(11:00~12:15)" into TimeSlot object
 */
function parseTimeSlot(timeStr: string): TimeSlot | null {
  const match = timeStr.match(/^([월화수목금토일])\((\d{2}):(\d{2})~(\d{2}):(\d{2})\)$/);
  if (!match) return null;

  const [, day, startHour, startMin, endHour, endMin] = match;
  return {
    day,
    startMinutes: parseInt(startHour) * 60 + parseInt(startMin),
    endMinutes: parseInt(endHour) * 60 + parseInt(endMin),
  };
}

/**
 * Parse placeAndTime.time string (e.g., "월(11:00~12:15)/수(11:00~12:15)")
 * into an array of TimeSlot objects
 */
export function parseTimeString(timeString: string | null | undefined): TimeSlot[] {
  if (!timeString) return [];

  const slots = timeString.split('/');
  const result: TimeSlot[] = [];

  for (const slot of slots) {
    const parsed = parseTimeSlot(slot.trim());
    if (parsed) {
      result.push(parsed);
    }
  }

  return result;
}

/**
 * Check if two time slots overlap
 */
function slotsOverlap(slot1: TimeSlot, slot2: TimeSlot): boolean {
  if (slot1.day !== slot2.day) return false;

  return slot1.startMinutes < slot2.endMinutes && slot2.startMinutes < slot1.endMinutes;
}

/**
 * Check if any time slots from two courses overlap
 */
export function hasTimeConflict(
  courseTimeStr: string | null | undefined,
  existingTimeStr: string | null | undefined
): boolean {
  const courseSlots = parseTimeString(courseTimeStr);
  const existingSlots = parseTimeString(existingTimeStr);

  for (const courseSlot of courseSlots) {
    for (const existingSlot of existingSlots) {
      if (slotsOverlap(courseSlot, existingSlot)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Extract time string from placeAndTime JSON string
 */
export function extractTimeFromPlaceAndTime(placeAndTime: string | null | undefined): string | null {
  if (!placeAndTime) return null;

  try {
    const parsed = JSON.parse(placeAndTime);
    return parsed.time || null;
  } catch {
    return null;
  }
}

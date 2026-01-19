// ============================================================================
// Date Utilities
// ============================================================================

/**
 * Converts Firestore Timestamp, ISO string, or Date to a Date object.
 * Handles all common date formats from the backend.
 */
export const toDate = (value: any): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  
  // Firestore Timestamp has toDate() method
  if (value.toDate && typeof value.toDate === "function") {
    return value.toDate();
  }
  
  // Firestore Timestamp-like object with seconds
  if (typeof value.seconds === "number") {
    return new Date(value.seconds * 1000);
  }
  
  // ISO string
  if (typeof value === "string") {
    const date = new Date(value);
    return isNaN(date.getTime()) ? undefined : date;
  }
  
  return undefined;
};

/**
 * Formats a date for display in the UI.
 * Returns "No date" for undefined values and "Invalid date" for malformed inputs.
 */
export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "No date";
  
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) return "Invalid date";
  
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dateObj);
};

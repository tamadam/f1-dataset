export const formatDate = (rawDate: string, locale: "hu" | "en"): string => {
  const date = new Date(rawDate);

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

/**
 * Returns a valid locale for date formatting.
 *
 * Ensures that only 'hu' or 'en' are used. Defaults to 'en' for any other value.
 *
 * @param value - the locale value to validate
 * @returns 'hu' if value is 'hu', otherwise 'en'
 */
export const getValidLocaleForDate = (value: unknown): "hu" | "en" => {
  if (value === "hu") return value;
  return "en";
};

/**
 * Formats a date range into a human-readable string based on the locale.
 *
 * Examples:
 *   - English, same month:  "24-26 Oct"
 *   - English, different months: "30 Oct - 02 Nov"
 *   - Hungarian, same month: "Okt. 24-26"
 *   - Hungarian, different months: "Okt. 30 - Nov. 02"
 *
 * @param start - the start date of the event
 * @param end - the end date of the event
 * @param locale - either 'en' or 'hu', used to format month names correctly
 * @returns a formatted date range string suitable for display in the UI
 */
export const formatRaceDateRange = (
  start: Date,
  end: Date,
  locale: "hu" | "en"
): string => {
  const startParts = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
  }).formatToParts(start);

  const endParts = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
  }).formatToParts(end);

  const startMonth = startParts.find((p) => p.type === "month")?.value;
  const startDay = startParts.find((p) => p.type === "day")?.value;
  const endMonth = endParts.find((p) => p.type === "month")?.value;
  const endDay = endParts.find((p) => p.type === "day")?.value;

  if (startMonth === endMonth) {
    if (locale === "en") {
      return `${startDay}-${endDay} ${startMonth}`;
    }

    return `${startMonth} ${startDay}-${endDay}`;
  } else {
    if (locale === "en") {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
    }

    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }
};

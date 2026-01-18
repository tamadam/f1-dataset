/**
 * Extracts and validates finish positions.

 * Returns an array of valid positions (as strings).
 * Invalid or mixed values -> returns [].
 */
export function getValidFinishPositions(input: string | string[]): string[] {
  const isValidPosition = (pos: string) => {
    const num = Number(pos);
    return Number.isInteger(num) && num >= 1;
  };

  if (!input) return [];

  if (typeof input === "string") {
    return isValidPosition(input) ? [input] : [];
  }

  if (Array.isArray(input)) {
    return input.every(isValidPosition) ? input : [];
  }

  return [];
}

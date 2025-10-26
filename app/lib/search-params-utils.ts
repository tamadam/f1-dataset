/**
 * Extracts and validates finish positions from URL search params.
 * Supports:
 *   ?position=1
 *   ?position=19&position=25
 * Returns an array of valid positions (as strings).
 * Invalid or mixed values -> returns [].
 */
export function getValidFinishPositions(
  input: string | string[] | undefined
): string[] {
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

import { F1_FIRST_YEAR } from "../constants";

export const getAllF1Years = (options?: {
  excludeCurrent?: boolean;
}): number[] => {
  const currentYear = getCurrentYear();
  const endYear = options?.excludeCurrent ? currentYear - 1 : currentYear;

  const allF1Years = Array.from(
    { length: endYear - F1_FIRST_YEAR + 1 },
    (_, i) => F1_FIRST_YEAR + i
  );

  return allF1Years;
};

export const getAllF1YearsReverse = (): number[] => {
  return getAllF1Years().reverse();
};

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

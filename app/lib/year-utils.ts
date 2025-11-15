/* eslint-disable @typescript-eslint/no-unused-vars */
import { cacheLife } from "next/cache";
import { F1_FIRST_YEAR } from "../constants";

export const getAllF1Years = (options?: {
  excludeCurrent?: boolean;
}): number[] => {
  return [2021, 2022, 2023, 2024];
  /*   const currentYear = getCurrentYear();
  const endYear = options?.excludeCurrent ? currentYear - 1 : currentYear;

  const allF1Years = Array.from(
    { length: endYear - F1_FIRST_YEAR + 1 },
    (_, i) => F1_FIRST_YEAR + i
  );

  return allF1Years; */
};

export const getAllF1YearsReverse = (): number[] => {
  return getAllF1Years().reverse();
};

export const getCurrentYear = async (): Promise<number> => {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
};

import { F1_FIRST_YEAR } from "../constants";

export const getAllF1Years = () => {
    const currentYear = getCurrentYear();
    const allF1Years = Array.from(
    { length: currentYear - F1_FIRST_YEAR },
    (_, i) => F1_FIRST_YEAR + i
    );

    return allF1Years;
}

export const getAllF1YearsReverse = () => {
    return getAllF1Years().reverse();
}

export const getCurrentYear = () => {
    return new Date().getFullYear();
}
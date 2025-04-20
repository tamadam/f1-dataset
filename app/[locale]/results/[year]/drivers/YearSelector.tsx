"use client";

import { useRouter, useParams } from "next/navigation";

type YearSelectorProps = {
  selectedYear: string;
};

const YearSelector = ({ selectedYear }: YearSelectorProps) => {
  const router = useRouter();
  const { locale } = useParams();
  const start = 1950;
  const current = new Date().getFullYear();

  const years = Array.from({ length: current - start + 1 }, (_, i) =>
    (start + i).toString()
  ).reverse();

  return (
    <select
      value={selectedYear}
      onChange={(e) => {
        const year = e.target.value;
        router.push(`/${locale}/results/${year}/drivers`);
      }}
    >
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

export default YearSelector;

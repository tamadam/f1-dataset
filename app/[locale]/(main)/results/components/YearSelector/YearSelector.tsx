"use client";

import { getAllF1YearsReverse } from "@/app/lib/year-utils";
import { usePathname } from "next/navigation";
import { useRouter, useParams } from "next/navigation";
import { ChangeEvent } from "react";

type YearSelectorProps = {
  selectedYear: string;
};

const YearSelector = ({ selectedYear }: YearSelectorProps) => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const years = getAllF1YearsReverse();

  const handleYearChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newYear = event.target.value;
    const updatedPath = pathname.replace(`/${params.year}/`, `/${newYear}/`);

    router.push(updatedPath);
  };

  return (
    <select value={selectedYear} onChange={handleYearChange}>
      {years.map((year) => (
        <option key={year} value={year}>
          {year}
        </option>
      ))}
    </select>
  );
};

export default YearSelector;

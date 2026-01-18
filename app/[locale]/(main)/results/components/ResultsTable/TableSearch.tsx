"use client";

import useDebounce from "@/app/hooks/useDebounce";
import { useTranslations } from "next-intl";
import { memo, useState, useEffect } from "react";
import styles from "./TableSearch.module.scss";

type TableSearchProps = {
  onChange: (value: string) => void;
  placeholder: string;
  dataLength: number;
  filteredDataLength: number;
  debounceMs?: number;
};

const TableSearch = ({
  onChange,
  placeholder,
  dataLength,
  filteredDataLength,
  debounceMs = 300,
}: TableSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);
  const translate = useTranslations("General");

  // Notify parent whenever debounced value changes
  useEffect(() => {
    onChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onChange]);

  return (
    <div className={styles.searchWrapper}>
      <input
        type="text"
        value={searchTerm}
        placeholder={placeholder}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      {searchTerm && (
        <div className={styles.searchResultsCounter}>
          {translate("searchResultsCount", {
            filteredDataLength,
            dataLength,
          })}
        </div>
      )}
    </div>
  );
};

export default memo(TableSearch);

"use client";

import { CSSProperties } from "react";
import styles from "./ResultsTable.module.scss";
import { useRef, useEffect, useState } from "react";

export type ColumnDefinition<T> = {
  field: keyof T;
  header: string;
  renderCell?: (value: T) => string;
  styles?: {
    columnSize?: string;
    textAlign?: "left" | "center" | "right";
  };
};

interface ResultsTableProps<T> {
  caption: string;
  noDataText?: string;
  data: T[] | undefined;
  columns: ColumnDefinition<T>[];
  tableInlineStyles?: CSSProperties;
}

const ResultsTable = <T,>({
  caption,
  noDataText = "No data available",
  data,
  columns,
  tableInlineStyles = {},
}: ResultsTableProps<T>) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);

  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const updateShadows = () => {
      const { scrollLeft, scrollWidth, clientWidth } = content;
      setShowLeftShadow(scrollLeft > 0);
      setShowRightShadow(scrollLeft + clientWidth < scrollWidth - 1); // 1px threshold
    };

    updateShadows(); // Check on mount

    content.addEventListener("scroll", updateShadows);
    const resizeObserver = new ResizeObserver(updateShadows);
    resizeObserver.observe(content);

    return () => {
      content.removeEventListener("scroll", updateShadows);
      resizeObserver.disconnect();
    };
  }, []);

  const noDataAvailable = !data || data.length === 0;

  const columnStyle = {
    "--columns": columns
      .map((column) => column.styles?.columnSize || "1fr")
      .join(" "),
  } as CSSProperties;

  const getCellStyles = (column: ColumnDefinition<T>) => ({
    justifySelf: column.styles?.textAlign || "left",
  });

  return (
    <div>
      <div className={styles.tableCaption}>{caption}</div>
      <div className={styles.resultsTableOuterWrapper}>
        <div
          className={styles.shadowLeft}
          style={{ opacity: showLeftShadow ? 1 : 0 }}
        />
        <div
          className={styles.shadowRight}
          style={{ opacity: showRightShadow ? 1 : 0 }}
        />

        <div ref={contentRef} className={styles.resultsTableWrapper}>
          <table className={styles.resultsTable} style={tableInlineStyles}>
            <thead className={styles.tableHeaderWrapper}>
              <tr style={columnStyle}>
                {columns.map((column) => (
                  <th key={column.header} style={getCellStyles(column)}>
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={styles.tableBodyWrapper}>
              {noDataAvailable ? (
                <tr>
                  <td colSpan={columns.length}>{noDataText}</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index} style={columnStyle}>
                    {columns.map((column) => {
                      const value = item[column.field];
                      return (
                        <td key={column.header} style={getCellStyles(column)}>
                          {column.renderCell
                            ? column.renderCell(item)
                            : String(value)}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;

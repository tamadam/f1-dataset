"use client";

import { CSSProperties } from "react";
import styles from "./ResultsTable.module.scss";
import { useRef, useEffect, useState } from "react";
import clsx from "clsx";
import { DateTime } from "@/app/types/f1Common";
import { useParams } from "next/navigation";
import { DETAILS_URLS } from "@/app/constants";
import { Link, usePathname } from "@/i18n/navigation";
import { formatDate } from "@/app/lib/date-utils";
import { useTranslations } from "next-intl";

export type DetailItem = {
  label: string;
  date?: DateTime;
  disabled: boolean;
  order: number;
  urlKey: DETAILS_URLS | null;
};

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
  captionDescription?: string;
  noDataText?: string;
  data: T[] | undefined;
  detailList?: DetailItem[];
  columns: ColumnDefinition<T>[];
  tableInlineStyles?: CSSProperties;
}

const ResultsTable = <T,>({
  caption,
  captionDescription,
  noDataText,
  data,
  detailList,
  columns,
  tableInlineStyles = {},
}: ResultsTableProps<T>) => {
  const translate = useTranslations("General");
  const contentRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);
  const { year, category, subcategory } = useParams();
  const pathname = usePathname();

  const basePath = `/results/${year}/${category}/${subcategory}`;

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
    <div className={styles.resultsWrapperTable}>
      <div className={styles.tableCaption}>{caption}</div>
      {captionDescription && (
        <div className={styles.tableCaptionDescription}>
          {captionDescription}
        </div>
      )}
      <div
        className={clsx(styles.resultsWrapper, {
          [styles.multiTable]: Boolean(detailList),
        })}
      >
        {detailList && (
          <ul className={styles.detailSelectorList}>
            {detailList.map((detail) => {
              const href = detail.urlKey
                ? `${basePath}/${detail.urlKey}`
                : basePath;
              const isActive = pathname === href;
              const isClickable = !detail.disabled;

              return (
                <li
                  key={detail.label}
                  className={clsx(styles.detailElement, {
                    [styles.elementActive]: isActive,
                    [styles.clickableElement]: isClickable,
                  })}
                >
                  {isClickable ? (
                    <Link
                      href={
                        detail.urlKey
                          ? `${basePath}/${detail.urlKey}`
                          : basePath
                      }
                    >
                      <div className={styles.detailElementLabel}>
                        <span className={styles.elementLabel}>
                          {detail.label}
                        </span>
                        {detail.date && (
                          <span className={styles.elementDate}>
                            {formatDate(detail.date.date)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div
                      className={clsx(
                        styles.detailElementLabel,
                        styles.nonClickableElement
                      )}
                    >
                      <span className={styles.elementLabel}>
                        {detail.label}
                      </span>
                      {detail.date && (
                        <span className={styles.elementDate}>
                          {formatDate(detail.date.date)}
                        </span>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
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
                    <td colSpan={columns.length}>
                      {noDataText ?? translate("noData")}
                    </td>
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
    </div>
  );
};

export default ResultsTable;

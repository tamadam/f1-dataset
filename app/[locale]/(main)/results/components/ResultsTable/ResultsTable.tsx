/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CSSProperties, ReactNode } from "react";
import styles from "./ResultsTable.module.scss";
import { useRef, useEffect, useState } from "react";
import clsx from "clsx";
import { DateTime } from "@/app/types/f1Common";
import { useParams, useSearchParams } from "next/navigation";
import { DETAILS_URLS } from "@/app/constants";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { formatDate, getValidLocaleForDate } from "@/app/lib/date-utils";
import { useTranslations } from "next-intl";
import ViewSwitcher, { ViewMode } from "../ViewSwitcher/ViewSwitcher";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import Button from "@/app/components/Button";
import { Eye, EyeOff } from "@/app/components/icons";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
  urlHref?: (value: T) => string;
  styles?: {
    columnSize?: string;
    textAlign?: "left" | "center" | "right";
  };
};

interface ResultsTableProps<T> {
  caption: string;
  captionDescription?: string | ReactNode;
  noDataText?: string | ReactNode;
  data: T[] | undefined;
  chartData?: {
    options: any;
    data: any;
  };
  detailList?: DetailItem[];
  columns: ColumnDefinition<T>[];
  tableInlineStyles?: CSSProperties;
}

const ResultsTable = <T,>({
  caption,
  captionDescription,
  noDataText,
  data,
  chartData,
  detailList,
  columns,
  tableInlineStyles = {},
}: ResultsTableProps<T>) => {
  const translate = useTranslations("General");
  const contentRef = useRef<HTMLDivElement>(null);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const viewModeParam = searchParams.get("viewMode");
  const viewMode: ViewMode =
    viewModeParam === "table" || viewModeParam === "graph"
      ? viewModeParam
      : "table";

  const { locale, year, category, subcategory } = useParams();
  const pathname = usePathname();

  const chartRef = useRef(null);

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

  const safeLocal: "hu" | "en" = getValidLocaleForDate(locale);

  const noDataAvailable = !data || data.length === 0;

  const columnStyle = {
    "--columns": columns
      .map((column) => column.styles?.columnSize || "1fr")
      .join(" "),
  } as CSSProperties;

  const getCellStyles = (column: ColumnDefinition<T>) => ({
    justifySelf: column.styles?.textAlign || "left",
  });

  const handleViewChange = (view: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("viewMode", view);

    router.replace(`${pathname}?${params.toString()}`);
  };

  const [allHidden, setAllHidden] = useState(false);

  const handleToggleAllLines = () => {
    const chart = chartRef.current as any;
    if (!chart) return;

    const chartInstance = chart.chartInstance || chart;

    chartInstance.data.datasets.forEach((_: any, index: number) => {
      const meta = chartInstance.getDatasetMeta(index);
      meta.hidden = !allHidden;
    });

    chartInstance.update();
    setAllHidden(!allHidden);
  };

  // Add legend onClick override to track manual clicks for the toggle button
  const chartOptions = {
    ...chartData?.options,
    maintainAspectRatio: false,
    plugins: {
      ...chartData?.options?.plugins,
      legend: {
        ...chartData?.options?.plugins?.legend,
        onClick: (_: any, legendItem: any, legend: any) => {
          const chart = legend.chart;

          const index = legendItem.datasetIndex;
          const meta = chart.getDatasetMeta(index);
          meta.hidden =
            meta.hidden === null
              ? !chart.data.datasets[index].hidden
              : !meta.hidden;
          chart.update();

          const allHiddenNow = chart.data.datasets.every(
            (_: any, i: number) => {
              const m = chart.getDatasetMeta(i);
              return m.hidden;
            }
          );

          setAllHidden(allHiddenNow);
        },
      },
    },
  };

  return (
    <div className={styles.resultsWrapperTable}>
      <div className={styles.tableCaption}>
        <h1>{caption}</h1>
        {!noDataAvailable && chartData && (
          <ViewSwitcher
            defaultView={viewMode}
            onViewChange={handleViewChange}
          />
        )}
      </div>
      {captionDescription && (
        <div className={styles.tableCaptionDescription}>
          {captionDescription}
        </div>
      )}
      {!chartData || viewMode === "table" ? (
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
                              {formatDate(detail.date.date, safeLocal)}
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
                            {formatDate(detail.date.date, safeLocal)}
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
                            <td
                              key={column.header}
                              style={getCellStyles(column)}
                            >
                              {(() => {
                                const rawContent = column.renderCell
                                  ? column.renderCell(item)
                                  : String(value);

                                return column.urlHref ? (
                                  <Link
                                    href={column.urlHref(item)}
                                    className={styles.resultsTableLink}
                                  >
                                    {rawContent}
                                  </Link>
                                ) : (
                                  rawContent
                                );
                              })()}
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
      ) : (
        <div className={styles.chartWrapper}>
          {chartData?.data && (
            <>
              <Button
                onClick={handleToggleAllLines}
                variant="primary"
                className={styles.chartToggle}
              >
                <div className={styles.chartToggleLabel}>
                  {allHidden ? (
                    <>
                      <span>{translate("showAll")}</span>
                      <Eye width={24} height={24} />
                    </>
                  ) : (
                    <>
                      <span>{translate("hideAll")}</span>
                      <EyeOff width={24} height={24} />
                    </>
                  )}
                </div>
              </Button>
              <Line
                options={chartOptions}
                data={chartData.data}
                ref={chartRef}
                className={styles.chart}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsTable;

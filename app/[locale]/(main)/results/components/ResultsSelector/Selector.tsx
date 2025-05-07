"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { ArrowDown } from "@/app/components/icons";
import styles from "./Selector.module.scss";

type ElementType = string | number | { id: string; name: string };

interface SelectorProps {
  title: string;
  elements: ElementType[] | undefined;
  urlKey: string;
}

const Selector = ({ title, elements, urlKey }: SelectorProps) => {
  const params = useParams();
  const pathname = usePathname();
  const itemsRef = useRef<Record<string, HTMLLIElement | null>>({});

  useEffect(() => {
    const activeValue = params[urlKey] ? String(params[urlKey]) : "all";
    const activeElement = document.querySelector(
      `li[data-value="${activeValue}"]`
    );

    if (activeElement) {
      activeElement.scrollIntoView({ block: "start", behavior: "instant" });
      window.scrollTo({ top: 0 });
    }
  }, [params, urlKey]);

  const getElementId = (element: ElementType): string => {
    return typeof element === "object" && element !== null
      ? element.id
      : String(element);
  };

  const getElementName = (element: ElementType): string => {
    return typeof element === "object" && element !== null
      ? element.name
      : String(element);
  };

  const getElementHref = (value: string): string => {
    let basePath = pathname;

    if (urlKey === "subcategory") {
      if (params.subcategory) {
        return pathname.replace(
          `/${params.subcategory}`,
          value === "all" ? "" : `/${value}`
        );
      }
    } else {
      if (params.subcategory) {
        basePath = pathname.replace(`/${params.subcategory}`, "");
      }
    }

    return params[urlKey]
      ? basePath.replace(`${params[urlKey]}`, value)
      : `${basePath}/${value}`;
  };

  if (!elements) return null;

  return (
    <details open className={styles.selectorDetails}>
      <summary className={styles.selectorSummary}>
        <span>{title}</span>
        <ArrowDown width={24} height={24} />
      </summary>
      <div className={styles.selectorContent}>
        <ul>
          {urlKey === "subcategory" && (
            <li data-name={params["category"]} data-value="all">
              <Link
                href={getElementHref("all")}
                className={clsx({
                  [styles.active]: !params["subcategory"],
                })}
                scroll={false}
              >
                All
              </Link>
            </li>
          )}

          {elements.map((element) => {
            const elementId = getElementId(element);
            const elementName = getElementName(element);
            return (
              <li
                key={elementId}
                data-name={params["category"]}
                data-value={elementId}
                ref={(el) => {
                  itemsRef.current[elementId] = el;
                }}
              >
                <Link
                  href={getElementHref(elementId)}
                  className={clsx({
                    [styles.active]: params[urlKey] === elementId,
                  })}
                  scroll={false}
                >
                  {elementName}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </details>
  );
};

export default Selector;

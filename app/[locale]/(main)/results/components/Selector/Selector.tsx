"use client";

import { Link, usePathname } from "@/i18n/navigation";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import styles from "./Selector.module.scss";
import { useTranslations } from "next-intl";

export type SelectorElementType =
  | string
  | number
  | { id: string; name: string };

export interface SelectorProps {
  elements: SelectorElementType[] | undefined;
  urlKey: string;
  includeAllOption?: boolean;
  styleOptions?: {
    highlightSelectedItem?: boolean;
  };
}

const Selector = ({
  elements,
  urlKey,
  includeAllOption = false,
  styleOptions = { highlightSelectedItem: false },
}: SelectorProps) => {
  const params = useParams();
  const pathname = usePathname();
  const itemsRef = useRef<Record<string, HTMLLIElement | null>>({});
  const translate = useTranslations("General");

  useEffect(() => {
    const activeValue = params[urlKey] ? String(params[urlKey]) : "all";
    const activeElement = itemsRef.current[activeValue];

    if (activeElement) {
      activeElement.scrollIntoView({ block: "start", behavior: "instant" });
      window.scrollTo({ top: 0 });
    }
  }, [params, urlKey]);

  const getElementId = (element: SelectorElementType): string => {
    return typeof element === "object" && element !== null
      ? element.id
      : String(element);
  };

  const getElementName = (element: SelectorElementType): string => {
    return typeof element === "object" && element !== null
      ? element.name
      : String(element);
  };

  const getElementHref = (value: string): string => {
    let basePath = pathname;

    if (urlKey === "subcategory") {
      if (params.subcategory) {
        return pathname
          .replace(`/${params.subcategory}`, value === "all" ? "" : `/${value}`)
          .replace(`/${params.detail}`, "");
      }
    } else {
      if (params.subcategory) {
        basePath = pathname
          .replace(`/${params.subcategory}`, "")
          .replace(`/${params.detail}`, "");
      }
    }

    return params[urlKey]
      ? basePath.replace(`${params[urlKey]}`, value)
      : `${basePath}/${value}`;
  };

  if (!elements) return null;
  return (
    <ul className={styles.selector}>
      {includeAllOption && (
        <li data-value="all">
          <Link
            href={getElementHref("all")}
            className={clsx({
              [styles.active]: !params[urlKey],
            })}
            scroll={false}
            prefetch={false}
          >
            {translate("all")}
          </Link>
        </li>
      )}

      {elements.map((element) => {
        const elementId = getElementId(element);
        const elementName = getElementName(element);

        return (
          <li
            key={elementId}
            data-value={elementId}
            ref={(el) => {
              itemsRef.current[elementId] = el;
            }}
          >
            <Link
              href={getElementHref(elementId)}
              className={clsx({
                [styles.active]: params[urlKey] === elementId,
                [styles.highlightSelectedItem]:
                  params[urlKey] === elementId &&
                  styleOptions.highlightSelectedItem,
              })}
              scroll={false}
              prefetch={false}
            >
              {elementName}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default Selector;

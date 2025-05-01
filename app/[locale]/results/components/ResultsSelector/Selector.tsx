"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";

interface SelectorProps {
  title: string;
  elements: string[] | number[] | undefined;
  urlKey?: string;
}

const Selector = ({ title, elements, urlKey }: SelectorProps) => {
  const params = useParams();
  const pathname = usePathname();

  return (
    <details>
      <summary>{title}</summary>
      <div>
        {elements && (
          <ul>
            {elements.map((element) => {
              return (
                <li key={element}>
                  <Link
                    href={
                      urlKey
                        ? pathname.replace(`${params[urlKey]}`, `${element}`)
                        : ""
                    }
                  >
                    {element}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </details>
  );
};

export default Selector;

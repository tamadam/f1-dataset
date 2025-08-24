import * as React from "react";
import type { SVGProps } from "react";
const SvgDataTable = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 32 32"
    {...props}
  >
    <path d="M8 18h4v2H8zM14 18h4v2h-4zM8 14h4v2H8zM14 22h4v2h-4zM20 14h4v2h-4zM20 22h4v2h-4z" />
    <path d="M27 3H5a2.003 2.003 0 0 0-2 2v22a2.003 2.003 0 0 0 2 2h22a2.003 2.003 0 0 0 2-2V5a2.003 2.003 0 0 0-2-2m0 2v4H5V5ZM5 27V11h22v16Z" />
    <path
      d="M0 0h32v32H0z"
      data-name="&lt;Transparent Rectangle&gt;"
      style={{
        fill: "none",
      }}
    />
  </svg>
);
export default SvgDataTable;

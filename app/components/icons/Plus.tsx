import * as React from "react";
import type { SVGProps } from "react";
const SvgPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    data-name="Add"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M11 2v9H2v2h9v9h2v-9h9v-2h-9V2z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgPlus;

import * as React from "react";
import type { SVGProps } from "react";
const SvgBurger = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 26 20"
    {...props}
  >
    <path
      fill="currentColor"
      d="M0 20h26v-3.333H0zm0-8.333h26V8.333H0zM0 0v3.333h26V0z"
    />
  </svg>
);
export default SvgBurger;

import * as React from "react";
import type { SVGProps } from "react";
const SvgClose = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 26 26"
    {...props}
  >
    <path
      fill="currentColor"
      d="M26 2.619 23.381 0 13 10.381 2.619 0 0 2.619 10.381 13 0 23.381 2.619 26 13 15.619 23.381 26 26 23.381 15.619 13z"
    />
  </svg>
);
export default SvgClose;

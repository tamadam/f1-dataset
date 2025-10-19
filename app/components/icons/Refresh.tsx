import * as React from "react";
import type { SVGProps } from "react";
const SvgRefresh = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 21a9 9 0 0 0 6.708-15L16 3m-4 0a9 9 0 0 0-6.708 15L8 21M21 3h-5m0 0v5M3 21h5m0 0v-5"
    />
  </svg>
);
export default SvgRefresh;

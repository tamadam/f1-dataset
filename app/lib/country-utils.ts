// The Jolpica API returns some country names (like "UK", "USA", "UAE")
// that don’t match the country names used in the package 'countries-list'.
// For example, Jolpica provides "UK" while the package expects "United Kingdom".
// This mapping ensures consistent country naming between the two sources.

import { getCountryCode, TCountryCode } from "countries-list";

const countryMap: Record<string, string> = {
  UK: "United Kingdom",
  USA: "United States",
  UAE: "United Arab Emirates",
};

export const getCountryCodeFromName = (
  country: string
): TCountryCode | false => {
  const countryName = countryMap[country || ""] || country;
  const countryCode = getCountryCode(countryName);

  return countryCode;
};

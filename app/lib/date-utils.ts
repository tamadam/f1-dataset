export const formatDate = (rawDate: string, locale: "hu" | "en"): string => {
  const date = new Date(rawDate);

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
};

export const getValidLocaleForDate = (value: unknown): "hu" | "en" => {
  if (value === "hu") return value;
  return "en";
};


  
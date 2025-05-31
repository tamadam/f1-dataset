export const formatDate = (rawDate: string): string => {
    const monthMap = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    const [year, month, day] = rawDate.split("-"); // "2025-04-20" → ["2025", "04", "20"]
    const monthIndex = parseInt(month, 10) - 1;
  
    return `${day} ${monthMap[monthIndex]} ${year}`;
};
  
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const weekdayToNumber = (weekday: number) => {
  if (weekday < 0 || weekday > 6) throw new Error('Invalid weekday');
  return weekdays[weekday];
};

export function extractDomainName(domain: string) {
  const parts: string[] = domain.split('.');
  if (parts.length <= 1) return domain;
  const lastPart = parts[parts.length - 1];
  const secondToLastPart = parts[parts.length - 2];

  if (parts.length > 2 && parts.includes('com')) {
    // For .com domains, return the name without the .com extension
    return parts[parts.length - 3];
  } else {
    // For other domains, return the name as is
    return secondToLastPart;
  }
}
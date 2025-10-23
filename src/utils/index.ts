export const getFlagEmoji = (isoCode?: string) => {
  if (!isoCode) return "🏴";

  if (isoCode === "GB-ENG") {
    return "🏴󠁧󠁢󠁥󠁮󠁧󠁿";
  }
  if (isoCode === "GB-WLS") {
    return "🏴󠁧󠁢󠁷󠁬󠁳󠁿";
  }
  if (isoCode === "GB-SCT") {
    return "🏴󠁧󠁢󠁳󠁣󠁴󠁿";
  }
  if (isoCode === "GB-NIR") {
    // The only official flag in Northern Ireland is the Union Flag of the United Kingdom.
    return "🇬🇧";
  }

  return isoCode.toUpperCase().replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
};

export const normalizeFill = (svg: string): string => {
  const currentColor = 'fill="currentColor"';
  return svg.replace(/\sfill="#[0-9a-fA-F]{3,8}"/g, (match) => {
    return match.includes(currentColor) ? match : ` ${currentColor}`;
  });
};

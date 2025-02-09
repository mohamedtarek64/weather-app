const locale = navigator.language || "en-US";

const formatWithOptions = (timestamp, options = {}, timezone) => {
  if (!timestamp) return "";
  let date = new Date(timestamp);

  if (typeof timezone === "number" && Number.isFinite(timezone)) {
    date = new Date(date.getTime() + timezone * 1000);
    const formatter = new Intl.DateTimeFormat(locale, {
      timeZone: "UTC",
      ...options,
    });
    return formatter.format(date);
  }

  const normalizedTimeZone =
    typeof timezone === "string" && timezone.trim().length > 0 ? timezone : undefined;

  const formatter = new Intl.DateTimeFormat(locale, {
    timeZone: normalizedTimeZone,
    ...options,
  });
  return formatter.format(date);
};

export const formatDate = (timestamp, options = {}) => {
  const { timeZone, ...rest } = options;
  return formatWithOptions(
    timestamp,
    {
      weekday: "long",
      month: "short",
      day: "numeric",
      ...rest,
    },
    timeZone
  );
};

export const getDayName = (timestamp, timezone) =>
  formatWithOptions(timestamp, { weekday: "short" }, timezone);

export const getTime = (timestamp, options = {}) => {
  const { timeZone, ...rest } = options;
  return formatWithOptions(
    timestamp,
    {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      ...rest,
    },
    timeZone
  );
};

export const formatSunTime = (timestamp, timezone) =>
  getTime(timestamp, { timeZone: timezone });

export const formatDateTime = (timestamp, timezone) =>
  formatWithOptions(
    timestamp,
    {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
    timezone
  );

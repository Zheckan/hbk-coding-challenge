type AlertDateFormatOptions = Readonly<{
  locale?: string | readonly string[];
  timeZone?: string;
}>;

const alertDateFormat: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
};

export function formatAlertDate(
  dateTime: string,
  options: AlertDateFormatOptions = {},
): string {
  return new Intl.DateTimeFormat(options.locale, {
    ...alertDateFormat,
    ...(options.timeZone === undefined ? {} : { timeZone: options.timeZone }),
  }).format(new Date(dateTime));
}

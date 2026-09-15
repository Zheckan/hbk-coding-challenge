import type { AlertsDateBounds } from "./alerts-list-state";

export type AlertsDateOption = Readonly<{
  value: string;
  label: string;
}>;

export function getAlertsDateOptions(
  dateBounds: AlertsDateBounds,
): readonly AlertsDateOption[] {
  const formatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const currentDate = parseLocalDate(dateBounds.min);
  const lastDate = parseLocalDate(dateBounds.max);
  const options: AlertsDateOption[] = [];

  while (currentDate <= lastDate) {
    options.push({
      value: formatLocalDate(currentDate),
      label: formatter.format(currentDate),
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return options;
}

function parseLocalDate(value: string): Date {
  return new Date(
    Number(value.slice(0, 4)),
    Number(value.slice(5, 7)) - 1,
    Number(value.slice(8, 10)),
  );
}

function formatLocalDate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

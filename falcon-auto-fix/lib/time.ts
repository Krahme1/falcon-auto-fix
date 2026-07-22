export const BUSINESS_TZ = "America/Toronto";

export function torontoDateTime(date: string, time: string) {
  const [y,m,d] = date.split("-").map(Number);
  const [hh,mm] = time.split(":").map(Number);
  const approx = new Date(Date.UTC(y, m-1, d, hh, mm));
  const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: BUSINESS_TZ, timeZoneName: "shortOffset", hour: "2-digit" });
  const zone = fmt.formatToParts(approx).find(p => p.type === "timeZoneName")?.value || "GMT-4";
  const match = zone.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  const sign = match?.[1] === "-" ? -1 : 1;
  const offsetMinutes = match ? sign * (Number(match[2]) * 60 + Number(match[3] || 0)) : -240;
  return new Date(Date.UTC(y, m-1, d, hh, mm) - offsetMinutes * 60_000);
}

export function torontoDateTimeLocal(value:string){
  const [date,time="00:00"] = value.split("T");
  return torontoDateTime(date,time.slice(0,5));
}

export function formatLocal(dt: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: BUSINESS_TZ, dateStyle: "medium", timeStyle: "short" }).format(dt);
}

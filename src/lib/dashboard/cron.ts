// Minimal 5-field cron evaluator scoped to the expressions used by our
// scheduled workflows: `*`, `N`, `*/N`, comma-separated lists. No DOW name
// aliases, no `?`, no ranges with steps. We only need next-fire calculation.
//
// Cron fields, in order: minute (0-59), hour (0-23), day-of-month (1-31),
// month (1-12), day-of-week (0-6, Sun=0). GitHub Actions cron is UTC.

type FieldRange = { min: number; max: number };

const FIELDS: FieldRange[] = [
  { min: 0, max: 59 }, // minute
  { min: 0, max: 23 }, // hour
  { min: 1, max: 31 }, // day-of-month
  { min: 1, max: 12 }, // month
  { min: 0, max: 6 }, // day-of-week
];

function expandField(token: string, range: FieldRange): Set<number> {
  const out = new Set<number>();
  for (const part of token.split(",")) {
    if (part === "*") {
      for (let i = range.min; i <= range.max; i += 1) out.add(i);
      continue;
    }
    const stepMatch = part.match(/^\*\/(\d+)$/);
    if (stepMatch) {
      const step = Number(stepMatch[1]);
      if (!Number.isFinite(step) || step <= 0) {
        throw new Error(`Invalid cron step: ${part}`);
      }
      for (let i = range.min; i <= range.max; i += step) out.add(i);
      continue;
    }
    const n = Number(part);
    if (!Number.isInteger(n) || n < range.min || n > range.max) {
      throw new Error(`Unsupported cron token: ${part}`);
    }
    out.add(n);
  }
  return out;
}

export type ParsedCron = {
  expression: string;
  minutes: Set<number>;
  hours: Set<number>;
  daysOfMonth: Set<number>;
  months: Set<number>;
  daysOfWeek: Set<number>;
};

export function parseCron(expression: string): ParsedCron {
  const tokens = expression.trim().split(/\s+/);
  if (tokens.length !== 5) {
    throw new Error(
      `Expected 5 cron fields, got ${tokens.length}: "${expression}"`,
    );
  }
  const [minutes, hours, daysOfMonth, months, daysOfWeek] = tokens.map(
    (t, i) => expandField(t, FIELDS[i]),
  );
  return {
    expression,
    minutes,
    hours,
    daysOfMonth,
    months,
    daysOfWeek,
  };
}

// Brute-force scan minute-by-minute up to 366 days ahead. Plenty fast for our
// few-second admin page render and avoids reinventing a real cron library.
export function nextRun(parsed: ParsedCron, from: Date = new Date()): Date {
  const start = new Date(from.getTime());
  start.setUTCSeconds(0, 0);
  start.setUTCMinutes(start.getUTCMinutes() + 1);

  const limit = 366 * 24 * 60;
  for (let step = 0; step < limit; step += 1) {
    const d = new Date(start.getTime() + step * 60_000);
    if (!parsed.minutes.has(d.getUTCMinutes())) continue;
    if (!parsed.hours.has(d.getUTCHours())) continue;
    if (!parsed.months.has(d.getUTCMonth() + 1)) continue;
    // POSIX: when both DOM and DOW are restricted (not `*`), either match.
    // Our expressions both leave them at `*` so we just AND for safety.
    if (!parsed.daysOfMonth.has(d.getUTCDate())) continue;
    if (!parsed.daysOfWeek.has(d.getUTCDay())) continue;
    return d;
  }
  throw new Error(`No cron match within a year for "${parsed.expression}"`);
}

// Tiny cron-next util. Supports only the cron shapes this repo uses:
//
//   "*/N * * * *"     — every N minutes
//   "M */N * * *"     — every N hours at minute M
//   "M N * * *"       — daily at HH:MM (UTC)
//   "M H */N * *"     — every N days at HH:MM
//
// Returns the next firing Date in UTC, or null if the expression isn't
// one of the supported shapes. We don't import a full cron library —
// it'd add ~30 KB for a feature that needs four patterns.

export function describeCron(expr: string): string {
  const m1 = expr.match(/^\*\/(\d+)\s+\*\s+\*\s+\*\s+\*$/);
  if (m1) return `every ${m1[1]} min`;
  const m2 = expr.match(/^(\d+)\s+\*\/(\d+)\s+\*\s+\*\s+\*$/);
  if (m2) return `every ${m2[2]}h at :${m2[1].padStart(2, "0")}`;
  const m3 = expr.match(/^(\d+)\s+(\d+)\s+\*\s+\*\s+\*$/);
  if (m3)
    return `daily at ${m3[2].padStart(2, "0")}:${m3[1].padStart(2, "0")} UTC`;
  return expr;
}

export function nextRun(expr: string, now: Date = new Date()): Date | null {
  // Shape: */N * * * *  (every N minutes)
  let m = expr.match(/^\*\/(\d+)\s+\*\s+\*\s+\*\s+\*$/);
  if (m) {
    const step = parseInt(m[1], 10);
    if (!Number.isFinite(step) || step <= 0) return null;
    const next = new Date(now);
    next.setUTCSeconds(0, 0);
    const minutesNow = next.getUTCMinutes();
    const minutesUntil = step - (minutesNow % step) || step;
    next.setUTCMinutes(minutesNow + minutesUntil);
    return next;
  }

  // Shape: M */N * * *  (every N hours at minute M)
  m = expr.match(/^(\d+)\s+\*\/(\d+)\s+\*\s+\*\s+\*$/);
  if (m) {
    const minute = parseInt(m[1], 10);
    const step = parseInt(m[2], 10);
    if (!Number.isFinite(minute) || !Number.isFinite(step) || step <= 0)
      return null;
    const next = new Date(now);
    next.setUTCSeconds(0, 0);
    next.setUTCMinutes(minute);
    const hourNow = next.getUTCHours();
    const hoursUntil = step - (hourNow % step);
    if (hoursUntil === step && next > now) {
      // already past the minute mark this hour but next.h % step === 0
      return next;
    }
    next.setUTCHours(hourNow + hoursUntil);
    if (next <= now) next.setUTCHours(next.getUTCHours() + step);
    return next;
  }

  // Shape: M H * * *  (daily at HH:MM UTC)
  m = expr.match(/^(\d+)\s+(\d+)\s+\*\s+\*\s+\*$/);
  if (m) {
    const minute = parseInt(m[1], 10);
    const hour = parseInt(m[2], 10);
    if (!Number.isFinite(minute) || !Number.isFinite(hour)) return null;
    const next = new Date(now);
    next.setUTCSeconds(0, 0);
    next.setUTCMilliseconds(0);
    next.setUTCMinutes(minute);
    next.setUTCHours(hour);
    if (next <= now) next.setUTCDate(next.getUTCDate() + 1);
    return next;
  }

  return null;
}

// Pick the soonest next-run across multiple cron expressions.
export function soonestNext(exprs: string[], now = new Date()): Date | null {
  const candidates = exprs
    .map((e) => nextRun(e, now))
    .filter((d): d is Date => d !== null);
  if (!candidates.length) return null;
  return candidates.reduce((min, d) => (d < min ? d : min));
}

export function formatRelative(target: Date, now = new Date()): string {
  const diff = (target.getTime() - now.getTime()) / 1000;
  if (diff < 0) return "any moment";
  if (diff < 60) return `in ${Math.round(diff)}s`;
  if (diff < 3600) return `in ${Math.round(diff / 60)} min`;
  if (diff < 86_400) {
    const h = Math.floor(diff / 3600);
    const m = Math.round((diff % 3600) / 60);
    return m > 0 ? `in ${h}h ${m}m` : `in ${h}h`;
  }
  return `in ${Math.round(diff / 86_400)}d`;
}

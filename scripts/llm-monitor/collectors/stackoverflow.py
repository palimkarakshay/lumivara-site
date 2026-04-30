#!/usr/bin/env python3
"""
Stack Overflow collector — pulls recent questions tagged with the
LLMs / SDKs / frameworks this pipeline depends on.

Uses the StackExchange API v2.3:

    https://api.stackexchange.com/docs/questions

No auth required for read access. Anonymous quota is 300 req/day per
IP, which jumps to 10,000 req/day with a free `key` parameter
(register at https://stackapps.com/apps/oauth/register — script-type
OAuth). At every-2h sweep cadence we hit ~7 tags × 12 sweeps = 84
req/day, well under the anonymous cap, so the key is not needed for v1.

Why Stack Overflow matters for this pipeline:
  * Questions tagged `claude-code` / `anthropic` / `openai-api` are
    where bugs surface as concrete reproductions before they reach
    HN front page.
  * Answers (when present) often contain the workaround the
    feedback step's `action_hint` field is meant to capture.
  * Slow signal but high quality — the inverse of Reddit.

Run standalone:
    python3 scripts/llm-monitor/collectors/stackoverflow.py
"""
from __future__ import annotations

import os
import urllib.parse
from datetime import datetime, timedelta, timezone

from _common import (
    emit, http_get_json, load_sources, now_utc, strip_html, truncate, warn,
)

API = "https://api.stackexchange.com/2.3/questions"


def fetch_tag(tag: str, since_ts: int, key: str) -> list[dict]:
    params = {
        "order": "desc",
        "sort": "creation",
        "tagged": tag,
        "site": "stackoverflow",
        "pagesize": "50",
        "fromdate": str(since_ts),
        # `withbody` returns the question body so the analyzer can
        # see actual repro steps instead of just titles.
        "filter": "withbody",
    }
    if key:
        params["key"] = key
    url = f"{API}?{urllib.parse.urlencode(params)}"
    try:
        resp = http_get_json(url)
    except Exception as e:  # noqa: BLE001
        warn(f"stackoverflow: tag {tag!r} fetch failed: {e}")
        return []
    # StackExchange embeds rate-limit info — surface it on stderr so a
    # stuck cron is easy to diagnose.
    backoff = resp.get("backoff")
    if backoff:
        warn(f"stackoverflow: backoff requested by API for {tag!r}: {backoff}s")
    return resp.get("items", [])


def main() -> int:
    cfg = load_sources().get("stackoverflow", {})
    tags = cfg.get("tags", [])
    if not tags:
        warn("stackoverflow: no tags configured; skipping")
        return 0
    lookback_h = int(cfg.get("lookback_hours", 12))
    min_score = int(cfg.get("min_score", 0))
    cutoff = now_utc() - timedelta(hours=lookback_h)
    cutoff_ts = int(cutoff.timestamp())

    # Optional API key — read from env if set; collector is
    # intentionally happy with anonymous quota at this cadence.
    key = os.environ.get("STACKEXCHANGE_API_KEY", "").strip()
    if key:
        warn("stackoverflow: using authenticated quota")

    seen: set[str] = set()
    emitted = 0
    for tag in tags:
        for q in fetch_tag(tag, cutoff_ts, key):
            qid = str(q.get("question_id") or "")
            if not qid or qid in seen:
                continue
            seen.add(qid)

            score = int(q.get("score") or 0)
            if score < min_score:
                continue

            owner = q.get("owner") or {}
            ts = datetime.fromtimestamp(
                int(q.get("creation_date") or 0), tz=timezone.utc
            ).isoformat()
            body_text = strip_html(q.get("body") or "")

            emit({
                "source": "stackoverflow",
                "source_detail": tag,
                "id": f"so:{qid}",
                "url": q.get("link", ""),
                "title": truncate(q.get("title") or "", 300),
                "body": truncate(body_text),
                "author": owner.get("display_name", ""),
                "ts": ts,
                "score": score,
                "comments": int(q.get("answer_count") or 0),
                "raw": {
                    "tags": q.get("tags", []),
                    "is_answered": bool(q.get("is_answered")),
                    "view_count": int(q.get("view_count") or 0),
                },
            })
            emitted += 1

    warn(f"stackoverflow: emitted {emitted} records across {len(tags)} tags")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

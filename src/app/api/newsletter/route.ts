import { NextResponse } from "next/server";
import { z } from "zod";

const Schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const { email } = parsed.data;
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !pubId) {
    console.log(`[newsletter] ${new Date().toISOString()} subscribe (no Beehiiv creds): ${email}`);
    return NextResponse.json({ success: true });
  }

  const res = await fetch(
    `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email,
        utm_source: "lumivara-site",
        utm_medium: "web",
      }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    console.error(`[newsletter] Beehiiv error ${res.status}: ${text}`);
    return NextResponse.json({ error: "Subscription failed" }, { status: 502 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}

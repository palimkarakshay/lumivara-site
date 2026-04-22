import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * POST /api/contact — accepts two shapes:
 *   - newsletter: { type: "newsletter", email }
 *   - inquiry:    { type: "inquiry", name, email, organization?, size?, interests?, timeline?, message, consent }
 *
 * Currently logs to server console. Real email wiring (Resend) is a TODO.
 */

const NewsletterSchema = z.object({
  type: z.literal("newsletter"),
  email: z.string().email(),
});

const InquirySchema = z.object({
  type: z.literal("inquiry"),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  organization: z.string().max(200).optional(),
  size: z.string().max(64).optional(),
  interests: z.array(z.string()).optional(),
  timeline: z.string().max(64).optional(),
  message: z.string().min(1).max(4000),
  consent: z.boolean().refine((v) => v === true, {
    message: "Consent required",
  }),
});

const Payload = z.union([NewsletterSchema, InquirySchema]);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Payload.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const timestamp = new Date().toISOString();

  if (data.type === "newsletter") {
    console.log(
      `[contact] ${timestamp} newsletter subscribe: ${data.email}`
    );
  } else {
    console.log(`[contact] ${timestamp} inquiry from ${data.name} <${data.email}>`);
    console.log(JSON.stringify(data, null, 2));
  }

  // TODO (migration): integrate Resend.
  // import { Resend } from "resend";
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: "hello@lumivara.ca",
  //   to: process.env.CONTACT_EMAIL ?? "hello@lumivara.ca",
  //   subject: data.type === "inquiry" ? `New inquiry from ${data.name}` : "Newsletter subscription",
  //   text: JSON.stringify(data, null, 2),
  // });

  return NextResponse.json({ success: true });
}

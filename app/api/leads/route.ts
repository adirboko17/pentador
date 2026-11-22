import { leadEmail } from "./email";

const emailAddress = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;

function readField(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  const field = value.trim();
  return field.length <= maxLength && !/[\x00-\x1f\x7f]/.test(field) ? field : "";
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.split(";")[0].trim();
  if (contentType !== "application/json") {
    return Response.json({ error: "unsupported_content_type" }, { status: 415 });
  }

  const submission = await request.json().catch(() => null) as {
    name?: unknown;
    phone?: unknown;
    city?: unknown;
    website?: unknown;
  } | null;
  const name = readField(submission?.name, 100);
  const phone = readField(submission?.phone, 30);
  const city = readField(submission?.city, 100);
  const key = request.headers.get("idempotency-key") ?? "";
  const digitCount = phone.replace(/\D/g, "").length;

  if (
    !name || !city || submission?.website ||
    !/^\+?[0-9(). -]+$/.test(phone) || digitCount < 7 || digitCount > 15 ||
    !/^[a-f0-9]{32}$/.test(key)
  ) {
    return Response.json({ error: "invalid_details" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.LEAD_FROM_EMAIL?.trim() ?? "";
  const to = process.env.LEAD_TO_EMAIL?.trim() ?? "";

  if (!apiKey || !emailAddress.test(from) || !emailAddress.test(to)) {
    console.error("[leads] Missing or invalid email configuration");
    return Response.json({ error: "email_unavailable" }, { status: 503 });
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `pentador-lead/${key}`,
      },
      body: JSON.stringify({
        from: `Pentador <${from}>`,
        to: [to],
        ...leadEmail({ name, phone, city }),
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (response.ok) {
      return Response.json({ ok: true });
    }

    console.error("[leads] Resend rejected the email", response.status);
  } catch {
    console.error("[leads] Could not reach Resend");
  }

  return Response.json({ error: "email_unavailable" }, { status: 502 });
}

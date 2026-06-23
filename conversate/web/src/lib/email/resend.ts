import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY?.trim();

export function isResendConfigured(): boolean {
  return Boolean(apiKey);
}

function getClient(): Resend | null {
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function sendWelcomeEmail(opts: {
  to: string;
  name?: string;
}): Promise<{ ok: boolean; degraded?: boolean; error?: string }> {
  const resend = getClient();
  if (!resend) {
    return { ok: false, degraded: true, error: "RESEND_API_KEY not configured" };
  }
  try {
    await resend.emails.send({
      from: "Conversate <onboarding@resend.dev>",
      to: opts.to,
      subject: "Welcome to Conversate",
      html: `<p>Hi${opts.name ? ` ${opts.name}` : ""},</p><p>Your interview practice room is ready. Open <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/personas">Conversate</a> to start.</p>`,
    });
    return { ok: true };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "send failed",
    };
  }
}

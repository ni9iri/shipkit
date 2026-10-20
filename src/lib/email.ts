import { Resend } from "resend";
import { config } from "@/config";

export async function sendPurchaseEmail(to: string, planName: string) {
  // Created per call: the constructor throws without a key, which would break builds that import this module.
  const resend = new Resend(process.env.AUTH_RESEND_KEY);
  const { error } = await resend.emails.send({
    from: config.email.from,
    to,
    subject: `Your ${config.appName} ${planName} access`,
    text: `Thanks for buying ${config.appName} ${planName}!\n\nSign in with this email to get started: ${config.domain}/dashboard`,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}

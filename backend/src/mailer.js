// Mail sender. In development (no SMTP_HOST configured), prints to console.
// With SMTP env vars set, sends through nodemailer.

import nodemailer from "nodemailer";

const {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM = "Codenergy <noreply@codenergy.local>",
} = process.env;

let transporter = null;
const liveMode = Boolean(SMTP_HOST);

if (liveMode) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
  });
}

/**
 * Send an email. Falls back to console.log when SMTP is not configured.
 * @param {{to: string, subject: string, text: string, html?: string}} opts
 */
export async function sendMail({ to, subject, text, html }) {
  if (!liveMode) {
    // Dev stub
    const banner = "=".repeat(60);
    console.log(`\n${banner}\n[mailer] DEV MODE — email not actually sent`);
    console.log(`  From:    ${SMTP_FROM}`);
    console.log(`  To:      ${to}`);
    console.log(`  Subject: ${subject}`);
    if (text) {
      console.log(text.split("\n").map((l) => "    " + l).join("\n"));
    } else if (html) {
      console.log(html.split("\n").map((l) => "    " + l).join("\n"));
    }
    console.log(`${banner}\n`);
    return { dev: true };
  }

  const mailOptions = {
    from: SMTP_FROM,
    to,
    subject,
  };
  if (text) {
    mailOptions.text = text;
  }
  if (html) {
    mailOptions.html = html;
    if (!text) {
      mailOptions.text = html
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    }
  }

  const info = await transporter.sendMail(mailOptions);
  return { dev: false, messageId: info.messageId };
}

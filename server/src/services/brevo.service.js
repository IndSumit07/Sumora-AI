const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

import {
  createReminderEmailHtml,
  REMINDER_EMAIL_SUBJECT,
} from "./emails/reminderEmail.template.js";

function otpEmailHtml(title, description, otp) {
  return `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 440px; margin: 0 auto; padding: 40px 0;">
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="display: inline-block; width: 40px; height: 40px; background: #18181b; border-radius: 10px; line-height: 40px; color: #fff; font-weight: 700; font-size: 16px;">S</div>
    </div>
    <h2 style="text-align: center; font-size: 20px; font-weight: 600; color: #18181b; margin: 0 0 6px;">${title}</h2>
    <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 0 0 28px; line-height: 1.5;">${description}</p>
    <div style="text-align: center; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 0 0 28px;">
      <p style="font-size: 36px; font-weight: 700; letter-spacing: 10px; color: #18181b; margin: 0;">${otp}</p>
    </div>
    <p style="text-align: center; color: #9ca3af; font-size: 12px; margin: 0;">This code expires in 10 minutes.<br/>If you didn&rsquo;t request this, you can safely ignore this email.</p>
    <hr style="border: none; border-top: 1px solid #f3f4f6; margin: 32px 0 16px;" />
    <p style="text-align: center; color: #d1d5db; font-size: 11px; margin: 0;">Sumora AI</p>
  </div>`;
}

const emailConfig = {
  registration: {
    title: "Verify your email",
    description: "Use the code below to verify your Sumora AI account.",
    subject: "Sumora AI — Verify your email",
  },
  "forgot-password": {
    title: "Reset your password",
    description: "Use the code below to reset your Sumora AI password.",
    subject: "Sumora AI — Reset your password",
  },
  "change-password": {
    title: "Confirm password change",
    description: "Use the code below to confirm your password change.",
    subject: "Sumora AI — Confirm password change",
  },
  "change-email": {
    title: "Verify your new email",
    description: "Use the code below to confirm your new email address.",
    subject: "Sumora AI — Verify new email address",
  },
};

export async function sendOtpEmail(to, otp, type) {
  const config = emailConfig[type];
  if (!config) throw new Error(`Unknown email type: ${type}`);

  return sendEmail({
    to,
    subject: config.subject,
    htmlContent: otpEmailHtml(config.title, config.description, otp),
  });
}

export async function sendEmail({ to, subject, htmlContent }) {
  if (!to || !subject || !htmlContent) {
    throw new Error("sendEmail requires to, subject, and htmlContent");
  }

  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: "Sumora AI",
        email: process.env.BREVO_SENDER_EMAIL || "noreply@sumoraai.in",
      },
      to: [{ email: to }],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Brevo API error: ${response.status} — ${body}`);
  }

  return true;
}

export async function sendReminderEmail(to, username = "there") {
  return sendEmail({
    to,
    subject: REMINDER_EMAIL_SUBJECT,
    htmlContent: createReminderEmailHtml({ name: username }),
  });
}

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

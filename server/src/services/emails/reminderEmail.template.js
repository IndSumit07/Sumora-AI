const SUMORA_LOGO_URL =
  "https://res.cloudinary.com/dpk3qmjtx/image/upload/v1776322494/logo_zloinu.png";

export const REMINDER_EMAIL_SUBJECT =
  "A reminder from Sumora AI: continue your interview prep";

export function createReminderEmailHtml({ name = "there" } = {}) {
  return `
    <div style="margin:0;padding:40px 12px;background-color:#f9fafb;background-image:radial-gradient(circle at top, #fff7ed 0%, #f9fafb 100%);font-family:'Plus Jakarta Sans',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
            <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 40px -15px rgba(0,0,0,0.05),0 0 0 1px rgba(0,0,0,0.02);text-align:left;">
                <tr>
                <td style="height:6px;background:linear-gradient(90deg,#ea580c 0%,#fb923c 50%,#f97316 100%);"></td>
                </tr>

                <tr>
                <td style="padding:40px 40px 24px 40px;">
                    <div style="text-align:center;margin-bottom:32px;">
                    <div style="display:inline-block;padding:12px;background:#fef3c7;border-radius:16px;">
                        <img src="${SUMORA_LOGO_URL}" alt="Sumora AI" style="height:36px;width:auto;display:block;" />
                    </div>
                    </div>

                    <p style="margin:0 0 8px 0;font-size:13px;font-weight:600;color:#ea580c;text-transform:uppercase;letter-spacing:1px;text-align:center;">
                    Your Next Step
                    </p>
                    <h1 style="margin:0 0 24px 0;font-size:28px;font-weight:700;line-height:1.25;color:#111827;text-align:center;letter-spacing:-0.5px;">
                    Your next interview breakthrough is waiting.
                    </h1>

                    <p style="margin:0 0 16px 0;font-size:16px;line-height:1.6;color:#4b5563;">
                    Hi <strong>${name}</strong>,
                    </p>
                    <p style="margin:0 0 24px 0;font-size:16px;line-height:1.6;color:#4b5563;">
                    We noticed it's been a little while since your last session. Staying sharp is all about momentum. Even a short 15-minute practice session today can give you the edge you need for your upcoming interviews.
                    </p>

                    <div style="background:#fafafa;border:1px solid #f3f4f6;border-radius:16px;padding:24px;margin-bottom:32px;">
                    <p style="margin:0 0 16px 0;font-size:14px;font-weight:600;color:#374151;text-transform:uppercase;letter-spacing:0.5px;">
                        Jump right back in:
                    </p>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                        <td style="padding-bottom:12px;vertical-align:top;width:24px;">
                            <div style="background:#ea580c;color:#fff;border-radius:50%;width:18px;height:18px;text-align:center;line-height:18px;font-size:11px;font-weight:bold;">✓</div>
                        </td>
                        <td style="padding-bottom:12px;font-size:15px;color:#4b5563;line-height:1.4;">
                            <strong style="color:#111827;">Live Mock Interview:</strong> Practice under real pressure.
                        </td>
                        </tr>
                        <tr>
                        <td style="padding-bottom:12px;vertical-align:top;width:24px;">
                            <div style="background:#ea580c;color:#fff;border-radius:50%;width:18px;height:18px;text-align:center;line-height:18px;font-size:11px;font-weight:bold;">✓</div>
                        </td>
                        <td style="padding-bottom:12px;font-size:15px;color:#4b5563;line-height:1.4;">
                            <strong style="color:#111827;">Topic Preparation:</strong> Target and improve weak areas.
                        </td>
                        </tr>
                        <tr>
                        <td style="vertical-align:top;width:24px;">
                            <div style="background:#ea580c;color:#fff;border-radius:50%;width:18px;height:18px;text-align:center;line-height:18px;font-size:11px;font-weight:bold;">✓</div>
                        </td>
                        <td style="font-size:15px;color:#4b5563;line-height:1.4;">
                            <strong style="color:#111827;">Resume Match:</strong> See how you stack up against the JD.
                        </td>
                        </tr>
                    </table>
                    </div>

                    <div style="text-align:center;margin-bottom:32px;">
                    <a href="https://sumoraai.in/dashboard" style="display:inline-block;background:#ea580c;color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;padding:16px 32px;border-radius:99px;box-shadow:0 4px 6px -1px rgba(234,88,12,0.2), 0 2px 4px -1px rgba(234,88,12,0.1);">
                        Continue My Prep Journey &rarr;
                    </a>
                    </div>

                    <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px 0;" />

                    <p style="margin:0;font-size:15px;line-height:1.6;color:#4b5563;">
                    Cheering for your success,<br/>
                    <strong style="color:#111827;">The Sumora AI Team</strong>
                    </p>
                </td>
                </tr>
            </table>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;">
                <tr>
                <td style="padding:24px 20px 0 20px;text-align:center;font-size:12px;color:#6b7280;line-height:1.6;">
                    <strong>Sumora AI</strong> • Smart interview prep for real outcomes.<br/>
                    We built this to help you land the job you deserve.<br/><br/>
                <a href="#" style="color:#9ca3af;text-decoration:underline;">Unsubscribe</a> • <a href="https://sumoraai.in" style="color:#9ca3af;text-decoration:underline;">Visit Website</a>
                </td>
                </tr>
            </table>
            </td>
        </tr>
        </table>
    </div>`;
}

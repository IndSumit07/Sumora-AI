export const PROMO_EMAIL_SUBJECT =
  "Level up your interview prep with new Sumora AI features!";

export function createPromotionalEmailHtml({ name = "there" } = {}) {
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
                        <img src="https://res.cloudinary.com/dpk3qmjtx/image/upload/v1776322494/logo_zloinu.png" alt="Sumora AI" style="height:36px;width:auto;display:block;" />
                    </div>
                    </div>

                    <p style="margin:0 0 8px 0;font-size:13px;font-weight:600;color:#ea580c;text-transform:uppercase;letter-spacing:1px;text-align:center;">
                    Exciting New Features
                    </p>
                    <h1 style="margin:0 0 24px 0;font-size:28px;font-weight:700;line-height:1.25;color:#111827;text-align:center;letter-spacing:-0.5px;">
                    Unlock your true potential today.
                    </h1>

                    <p style="margin:0 0 32px 0;font-size:16px;line-height:1.6;color:#4b5563;text-align:center;">
                    Hi <strong>${name}</strong>,<br/><br/>
                    We're thrilled to to bring you game-changing tools to accelerate your interview prep. Preparing specifically for what matters has never been easier!
                    </p>

                    <!-- Feature 1: Topic Wise -->
                    <div style="margin-bottom:40px;">
                        <img src="https://res.cloudinary.com/dpk3qmjtx/image/upload/v1778172683/topic-wise-interviews_qgtjs2.png" alt="Topic Wise Interviews" style="width:100%;max-width:100%;height:auto;border-radius:16px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);margin-bottom:20px;" />
                        <h2 style="margin:0 0 12px 0;font-size:20px;font-weight:700;color:#111827;">Topic-Wise Interviews</h2>
                        <p style="margin:0;font-size:15px;line-height:1.6;color:#4b5563;">
                            Struggling with a specific subject? Dive deep into targeted topics and refine your answers until they are bulletproof. Practice what you actually need.
                        </p>
                    </div>

                    <!-- Feature 2: Company Wise -->
                    <div style="margin-bottom:40px;">
                        <img src="https://res.cloudinary.com/dpk3qmjtx/image/upload/v1778172677/company-wise-interviews_chjz48.png" alt="Company Wise Interviews" style="width:100%;max-width:100%;height:auto;border-radius:16px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);margin-bottom:20px;" />
                        <h2 style="margin:0 0 12px 0;font-size:20px;font-weight:700;color:#111827;">Company-Wise Interviews</h2>
                        <p style="margin:0;font-size:15px;line-height:1.6;color:#4b5563;">
                            Don't just prepare generally—prepare for *them*. Train with simulations tailored to the exact companies you are interviewing with, straight from real experiences.
                        </p>
                    </div>

                    <!-- Feature 3: Resume Analysis -->
                    <div style="margin-bottom:40px;">
                        <img src="https://res.cloudinary.com/dpk3qmjtx/image/upload/v1778172678/resume-analysis_peqtfp.png" alt="Resume Analysis" style="width:100%;max-width:100%;height:auto;border-radius:16px;box-shadow:0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05);margin-bottom:20px;" />
                        <h2 style="margin:0 0 12px 0;font-size:20px;font-weight:700;color:#111827;">AI Resume Analysis</h2>
                        <p style="margin:0;font-size:15px;line-height:1.6;color:#4b5563;">
                            Unsure if your resume passes the initial screen? Our advanced AI analyzes your resume against job descriptions and provides actionable feedback.
                        </p>
                    </div>

                    <div style="text-align:center;margin-bottom:32px;margin-top:40px;">
                    <a href="https://sumoraai.in/dashboard" style="display:inline-block;background:#ea580c;color:#ffffff;text-decoration:none;font-weight:600;font-size:16px;padding:16px 32px;border-radius:99px;box-shadow:0 4px 6px -1px rgba(234,88,12,0.2), 0 2px 4px -1px rgba(234,88,12,0.1);">
                        Explore New Features &rarr;
                    </a>
                    </div>

                    <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 24px 0;" />

                    <p style="margin:0;font-size:15px;line-height:1.6;color:#4b5563;">
                    Happy interviewing,<br/>
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

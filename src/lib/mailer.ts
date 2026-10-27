import nodemailer from "nodemailer";

export function isSmtpConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  );
}

export async function sendOtpEmail({
  to,
  otp,
  appName = "NEXHACK",
}: {
  to: string;
  otp: string;
  appName?: string;
}): Promise<{ success: boolean; mode: "smtp" | "dev_log"; error?: string }> {
  // If SMTP is NOT configured, print OTP to server console for testing/development
  if (!isSmtpConfigured()) {
    console.log("\n=======================================================");
    console.log(`🔐 [${appName} SECURITY] ADMIN LOGIN OTP DISPATCHED`);
    console.log(`📧 Destination Email: ${to}`);
    console.log(`🔑 Verification Code: ${otp}`);
    console.log(`⏳ Validity: 10 Minutes`);
    console.log("💡 Tip: Add SMTP_HOST, SMTP_USER, SMTP_PASS to .env.local for real emails.");
    console.log("=======================================================\n");

    return { success: true, mode: "dev_log" };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const fromAddress = process.env.SMTP_FROM || `"NEXHACK Security" <${process.env.SMTP_USER}>`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <title>${appName} Admin Security Verification</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0f19; padding: 40px 15px;">
        <tr>
          <td align="center">
            <table width="100%" max-width="520" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #111827; border: 1px solid #1f293d; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
              <!-- Header Gradient -->
              <tr>
                <td style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 32px 30px; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
                    NEX<span style="color: #67e8f9;">HACK</span>
                  </h1>
                  <p style="margin: 6px 0 0; font-size: 13px; color: #e2e8f0; font-weight: 500;">
                    Admin Security Authentication
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 36px 32px;">
                  <p style="margin: 0 0 16px; font-size: 15px; color: #cbd5e1; line-height: 1.6;">
                    Hello Admin,
                  </p>
                  <p style="margin: 0 0 24px; font-size: 14px; color: #94a3b8; line-height: 1.6;">
                    A sign-in request to the <strong>${appName} Control Console</strong> was initiated. Use the single-use verification code below to complete your authentication:
                  </p>

                  <!-- OTP Box -->
                  <div style="background-color: #090d16; border: 1px dashed #3b82f6; border-radius: 14px; padding: 22px; text-align: center; margin: 26px 0;">
                    <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #38bdf8; display: inline-block;">
                      ${otp}
                    </span>
                    <p style="margin: 10px 0 0; font-size: 11px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                      Expires in 10 minutes
                    </p>
                  </div>

                  <p style="margin: 0 0 16px; font-size: 13px; color: #94a3b8; line-height: 1.6;">
                    If you did not make this login request, no action is needed. Your account remains secured, but you may want to review your server logs.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color: #0d121f; padding: 20px 30px; text-align: center; border-top: 1px solid #1e293b;">
                  <p style="margin: 0; font-size: 11px; color: #64748b;">
                    © 2026 NEXHACK Community. Automated Security Dispatch.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to,
      subject: `[${appName} Admin] ${otp} is your verification code`,
      html: htmlContent,
      text: `Your ${appName} Admin Login verification code is: ${otp}. It will expire in 10 minutes.`,
    });

    return { success: true, mode: "smtp" };
  } catch (error: any) {
    console.error("Nodemailer error sending OTP:", error);
    return { success: false, mode: "smtp", error: error.message };
  }
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Generic transactional email helper                                          */
/* ─────────────────────────────────────────────────────────────────────────── */

async function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}): Promise<{ success: boolean; mode: "smtp" | "dev_log"; error?: string }> {
  if (!isSmtpConfigured()) {
    console.log(`\n📧 [NEXHACK EMAIL] To: ${to} | Subject: ${subject}`);
    console.log(text);
    return { success: true, mode: "dev_log" };
  }
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"NEXHACK" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text,
    });
    return { success: true, mode: "smtp" };
  } catch (err: any) {
    console.error("Email send error:", err);
    return { success: false, mode: "smtp", error: err.message };
  }
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Team Invitation Email                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */

export async function sendTeamInvitationEmail({
  to,
  invitedByName,
  teamName,
  hackathonName,
  acceptUrl,
  declineUrl,
  expiresAt,
}: {
  to: string;
  invitedByName: string;
  teamName: string;
  hackathonName: string;
  acceptUrl: string;
  declineUrl: string;
  expiresAt: string;
}) {
  const expiry = new Date(expiresAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Team Invitation</title></head>
<body style="margin:0;padding:0;background:#0b0f19;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#f1f5f9;">
<table width="100%" style="padding:40px 15px;background:#0b0f19;">
  <tr><td align="center">
    <table width="100%" style="max-width:520px;background:#111827;border:1px solid #1f293d;border-radius:20px;overflow:hidden;">
      <tr><td style="background:linear-gradient(135deg,#2563eb,#7c3aed);padding:28px 30px;text-align:center;">
        <h1 style="margin:0;font-size:22px;font-weight:900;color:#fff;">NEX<span style="color:#67e8f9;">HACK</span></h1>
        <p style="margin:6px 0 0;font-size:13px;color:#e2e8f0;">Team Invitation</p>
      </td></tr>
      <tr><td style="padding:32px;">
        <p style="font-size:15px;color:#cbd5e1;">Hi there,</p>
        <p style="font-size:14px;color:#94a3b8;line-height:1.6;">
          <strong style="color:#f1f5f9;">${invitedByName}</strong> has invited you to join team
          <strong style="color:#f1f5f9;">"${teamName}"</strong> for
          <strong style="color:#f1f5f9;">${hackathonName}</strong> on NEXHACK.
        </p>
        <div style="text-align:center;margin:28px 0;">
          <a href="${acceptUrl}" style="display:inline-block;padding:12px 28px;background:#2563eb;color:#fff;font-weight:700;font-size:14px;border-radius:12px;text-decoration:none;margin-right:10px;">Accept Invitation</a>
          <a href="${declineUrl}" style="display:inline-block;padding:12px 24px;background:#1e293b;color:#94a3b8;font-weight:600;font-size:13px;border-radius:12px;text-decoration:none;border:1px solid #334155;">Decline</a>
        </div>
        <p style="font-size:12px;color:#64748b;text-align:center;">This invitation expires on ${expiry}.</p>
      </td></tr>
      <tr><td style="background:#0d121f;padding:16px 30px;text-align:center;border-top:1px solid #1e293b;">
        <p style="margin:0;font-size:11px;color:#475569;">© 2026 NEXHACK. If you weren't expecting this, you can ignore this email.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
  return sendTransactionalEmail({
    to,
    subject: `[NEXHACK] ${invitedByName} invited you to join team "${teamName}"`,
    html,
    text: `${invitedByName} invited you to join team "${teamName}" for ${hackathonName}.\n\nAccept: ${acceptUrl}\nDecline: ${declineUrl}\n\nExpires: ${expiry}`,
  });
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Invitation Accepted Confirmation                                            */
/* ─────────────────────────────────────────────────────────────────────────── */

export async function sendInvitationAcceptedEmail({
  to,
  memberName,
  teamName,
  hackathonName,
  dashboardUrl,
}: {
  to: string;
  memberName: string;
  teamName: string;
  hackathonName: string;
  dashboardUrl: string;
}) {
  return sendTransactionalEmail({
    to,
    subject: `[NEXHACK] ${memberName} joined your team "${teamName}"`,
    html: `<p>${memberName} accepted your invitation and joined team <strong>${teamName}</strong> for ${hackathonName}.</p><p><a href="${dashboardUrl}">View Team Dashboard →</a></p>`,
    text: `${memberName} joined team "${teamName}" for ${hackathonName}.\n\nView team: ${dashboardUrl}`,
  });
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Submission Confirmation                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */

export async function sendSubmissionConfirmationEmail({
  to,
  teamName,
  hackathonName,
  roundName,
  dashboardUrl,
}: {
  to: string;
  teamName?: string;
  hackathonName: string;
  roundName: string;
  dashboardUrl: string;
}) {
  const who = teamName ? `Team "${teamName}"` : "Your submission";
  return sendTransactionalEmail({
    to,
    subject: `[NEXHACK] Submission confirmed – ${roundName}`,
    html: `<p>${who} has been successfully submitted for <strong>${roundName}</strong> in <strong>${hackathonName}</strong>.</p><p><a href="${dashboardUrl}">View Submission →</a></p>`,
    text: `${who} submitted for ${roundName} (${hackathonName}).\n\n${dashboardUrl}`,
  });
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Registration Verification Confirmation                                     */
/* ─────────────────────────────────────────────────────────────────────────── */

export async function sendRegistrationVerifiedEmail({
  to,
  name,
  hackathonName,
  dashboardUrl,
}: {
  to: string;
  name: string;
  hackathonName: string;
  dashboardUrl: string;
}) {
  return sendTransactionalEmail({
    to,
    subject: `[NEXHACK] Registration verified – ${hackathonName}`,
    html: `<p>Hi ${name},</p><p>Your registration for <strong>${hackathonName}</strong> has been verified on NEXHACK. You can now access rounds, submissions, and your team dashboard.</p><p><a href="${dashboardUrl}">Go to Dashboard →</a></p>`,
    text: `Hi ${name},\n\nYour registration for ${hackathonName} is verified.\n\n${dashboardUrl}`,
  });
}

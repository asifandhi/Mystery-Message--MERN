import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS?.trim(), // trimming spaces just in case
  },
  // Helps bypass some cloud provider connection issues
  tls: {
    rejectUnauthorized: false
  }
});

const BRAND_PRIMARY = "#1a56db";
const BRAND_DARK = "#1e2a45";
const BRAND_LIGHT_BG = "#f4f7ff";

function emailShell(title, bodyHtml) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND_LIGHT_BG};font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_LIGHT_BG};padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:8px;overflow:hidden;
                      box-shadow:0 2px 12px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:${BRAND_DARK};padding:24px 32px;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;letter-spacing:1px;">
                 MysteryMsg
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f0f4ff;padding:18px 32px;border-top:1px solid #dde6f5;">
              <p style="margin:0;font-size:12px;color:#7a8aa0;text-align:center;">
                This is an automated message from MysteryMsg. Please do not reply to this email.<br/>
                © ${new Date().getFullYear()} MysteryMsg. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export async function sendOTPEmail({ to, otp }) {
  const bodyHtml = `
    <h2 style="color:${BRAND_DARK};margin:0 0 4px;">Verify Your Account </h2>
    <p style="color:#4a5568;margin:0 0 24px;font-size:15px;">
      Use the OTP below to complete your verification. It is valid for <strong>10 minutes</strong>.
    </p>

    <!-- OTP box -->
    <div style="background:${BRAND_LIGHT_BG};border:2px solid ${BRAND_PRIMARY};
                border-radius:8px;padding:20px 24px;text-align:center;margin-bottom:28px;">
      <p style="margin:0;font-size:13px;color:#6b7280;letter-spacing:1px;">ONE-TIME PASSWORD</p>
      <p style="margin:10px 0 0;font-size:40px;font-weight:800;color:${BRAND_PRIMARY};
                letter-spacing:10px;">${otp}</p>
    </div>

    <p style="font-size:13px;color:#6b7280;margin:0 0 6px;">
      ⚠️ Never share this OTP with anyone, including MysteryMsg support staff.
    </p>
    <p style="font-size:13px;color:#6b7280;margin:0;">
      If you did not request this OTP, please ignore this email or contact support immediately.
    </p>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"MysteryMsg" <${process.env.EMAIL_USER}>`,
      to,
      subject: `Your MysteryMsg verification code: ${otp}`,
      html: emailShell('OTP Verification – MysteryMsg', bodyHtml),
    });
    return info;
  } catch (err) {
    console.error("Nodemailer Error:", err);
    throw err;
  }
}
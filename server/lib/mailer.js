const nodemailer = require("nodemailer");

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null; // not configured — caller should handle gracefully
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true", // true for port 465, false for 587/25
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Emails the full casting-call brief to the admin inbox. Manual curation
 * (v1): the admin reads this, reviews actor profiles, and reaches out to
 * the producer directly with suggested matches — there's no automated
 * matching yet.
 *
 * Returns { sent: boolean, error?: string } — never throws, so a failed
 * email never blocks the casting call from being saved.
 */
async function sendCastingCallNotification({ call, producer }) {
  const t = getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!t || !adminEmail) {
    console.warn("Mailer not configured (missing SMTP_* or ADMIN_EMAIL) — skipping email notification.");
    return { sent: false, error: "Email not configured" };
  }

  const producerInfo = producer || {};
  const tagsLine = call.tags?.length ? call.tags.join(", ") : "None specified";
  const deadlineStr = new Date(call.deadline).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  const submittedStr = call.createdAt
    ? new Date(call.createdAt).toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    })
    : new Date().toLocaleDateString("en-US", {
      year: "numeric", month: "long", day: "numeric",
    });

  const subject = `Casting Call Report: ${call.title} | ${producerInfo.company || "Casting.Home"}`;

  const text = `
CASTING.HOME | NEW CASTING CALL REPORT
Action required: review the brief and identify suitable actor profiles.

SUMMARY
  ${call.title}
  ${call.type} | ${call.location} | Deadline: ${deadlineStr}
  Submitted: ${submittedStr}

PRODUCTION CONTACT
  Company: ${producerInfo.company || "Not provided"}
  Contact: ${producerInfo.name || "Not provided"}
  Email:   ${producerInfo.email || "Not provided"}
  Phone:   ${producerInfo.phone || "Not provided"}

ROLE REQUIREMENTS
  Age range: ${call.ageRange || "Any"}
  Gender:    ${call.gender || "Any"}
  Tags:      ${tagsLine}

CASTING BRIEF
  ${call.description}

NEXT STEPS
  1. Review the brief and filter actor profiles by the stated requirements.
  2. Shortlist strong matches and contact the producer with recommendations.
  3. Keep the casting call ID for internal reference: ${call.id}
`.trim();

  const htmlValue = (value) => escapeHtml(value || "Not provided");
  const row = (label, value) => `
    <tr>
      <td style="padding:9px 0;color:#777;font-size:12px;text-transform:uppercase;letter-spacing:.08em;width:38%;vertical-align:top;">${label}</td>
      <td style="padding:9px 0;color:#18202b;font-size:14px;font-weight:600;vertical-align:top;">${htmlValue(value)}</td>
    </tr>`;

  const html = `
    <div style="margin:0;background:#f3f1ed;padding:28px 12px;font-family:Arial,sans-serif;color:#18202b;line-height:1.5;">
      <div style="max-width:680px;margin:0 auto;background:#fff;box-shadow:0 4px 18px rgba(24,32,43,.08);">
        <div style="background:#10156b;padding:26px 32px;color:#fff;">
          <div style="color:#f7e9a7;font-size:12px;font-weight:bold;letter-spacing:.18em;text-transform:uppercase;">Casting.Home</div>
          <h1 style="margin:14px 0 6px;font-size:27px;line-height:1.2;font-weight:700;">New casting call report</h1>
          <p style="margin:0;color:#d9dcff;font-size:14px;">A new brief is ready for review and actor matching.</p>
        </div>

        <div style="padding:28px 32px 34px;">
          <div style="border-left:4px solid #d4ae45;background:#fff9e7;padding:16px 18px;margin-bottom:26px;">
            <div style="color:#8b6b13;font-size:11px;font-weight:bold;letter-spacing:.12em;text-transform:uppercase;">Action required</div>
            <div style="font-size:20px;line-height:1.3;font-weight:700;margin-top:5px;">${htmlValue(call.title)}</div>
            <div style="color:#59616d;font-size:13px;margin-top:7px;">${htmlValue(call.type)} &nbsp;•&nbsp; ${htmlValue(call.location)} &nbsp;•&nbsp; Apply by ${htmlValue(deadlineStr)}</div>
          </div>

          <h2 style="font-size:16px;margin:0 0 10px;color:#10156b;">At a glance</h2>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;margin-bottom:26px;">
            ${row("Submitted", submittedStr)}
            ${row("Age range", call.ageRange || "Any")}
            ${row("Gender", call.gender || "Any")}
            ${row("Tags", tagsLine)}
          </table>

          <h2 style="font-size:16px;margin:0 0 10px;color:#10156b;">Casting brief</h2>
          <div style="background:#f7f7f5;border:1px solid #e8e6df;padding:17px 18px;color:#343b45;font-size:14px;white-space:pre-line;">${htmlValue(call.description)}</div>

          <h2 style="font-size:16px;margin:28px 0 10px;color:#10156b;">Production contact</h2>
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;">
            ${row("Company", producerInfo.company)}
            ${row("Contact", producerInfo.name)}
            ${row("Email", producerInfo.email)}
            ${row("Phone", producerInfo.phone)}
          </table>

          <div style="border-top:1px solid #e8e6df;margin-top:26px;padding-top:20px;color:#59616d;font-size:13px;">
            <strong style="color:#18202b;">Recommended next steps</strong>
            <ol style="margin:8px 0 0;padding-left:20px;">
              <li>Review the brief and filter actor profiles by the stated requirements.</li>
              <li>Shortlist strong matches and contact the producer with recommendations.</li>
            </ol>
          </div>
        </div>

        <div style="background:#f7f7f5;border-top:1px solid #e8e6df;padding:15px 32px;color:#7b818a;font-size:11px;">
          Internal reference: ${htmlValue(call.id)} &nbsp;•&nbsp; Submitted ${htmlValue(submittedStr)}
        </div>
      </div>
    </div>
  `;

  try {
    await t.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: adminEmail,
      subject,
      text,
      html,
    });
    return { sent: true };
  } catch (err) {
    console.error("Failed to send casting call notification email:", err);
    return { sent: false, error: err.message };
  }
}

module.exports = { sendCastingCallNotification };

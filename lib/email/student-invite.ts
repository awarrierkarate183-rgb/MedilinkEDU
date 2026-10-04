export function studentInviteMessage(opts: {
  firstName: string;
  inviteUrl: string;
  expiresAt: string;
}) {
  const name = opts.firstName.trim() || "there";
  const expires = new Date(opts.expiresAt).toLocaleDateString();
  const subject = "Create your MediLink student account";
  const text = [
    `Hi ${name},`,
    "",
    "Your chapter advisor invited you to MediLink.",
    "Open this link to create your student portal account and choose your password:",
    opts.inviteUrl,
    "",
    `This link expires on ${expires}.`,
    "This login only works in the student portal.",
  ].join("\n");
  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#f4f1ea;font-family:Arial,sans-serif;color:#0b1f3a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;">
      <tr>
        <td>
          <p style="margin:0 0 8px;font-size:14px;letter-spacing:0.08em;text-transform:uppercase;color:#8a6a12;">MediLink</p>
          <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">Create your student account</h1>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.5;">Hi ${escapeHtml(name)}, your chapter advisor invited you to MediLink. Click the button below, choose a password, and your login will open the student portal only.</p>
          <p style="margin:24px 0;">
            <a href="${escapeHtml(opts.inviteUrl)}" style="display:inline-block;background:#d4a017;color:#0b1f3a;text-decoration:none;font-weight:700;padding:14px 22px;border-radius:999px;">Create your student account</a>
          </p>
          <p style="margin:0;font-size:13px;line-height:1.5;color:#5c6b7a;">This link expires on ${escapeHtml(expires)}. If the button does not work, paste this address into your browser: ${escapeHtml(opts.inviteUrl)}</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  return { subject, text, html };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

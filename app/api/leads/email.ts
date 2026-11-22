const emailFields = [
  ["שם מלא", "name"],
  ["טלפון", "phone"],
  ["עיר מגורים", "city"],
] as const;

function escapeHtml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

export function leadEmail(details: { name: string; phone: string; city: string }) {
  const { phone } = details;
  const callNumber = (phone.startsWith("+") ? "+" : "") + phone.replace(/\D/g, "");
  const rows = emailFields.map(([label, field]) => `
    <tr>
      <th scope="row" align="right" width="88" style="padding:12px 0;border-bottom:1px solid #e9ded4;color:#64544a;font-size:14px;font-weight:400;">${label}</th>
      <td style="padding:12px 14px 12px 0;border-bottom:1px solid #e9ded4;font-size:16px;font-weight:700;overflow-wrap:anywhere;word-break:break-word;">
        <span dir="${field === "phone" ? "ltr" : "auto"}">${escapeHtml(details[field])}</span>
      </td>
    </tr>`).join("");

  return {
    subject: "Pentador | ליד חדש לתיאום התקנה",
    text: [
      "התקבלה בקשה לתיאום התקנה באתר Pentador.",
      ...emailFields.map(([label, field]) => `${label}: ${details[field]}`),
    ].join("\n"),
    html: `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background-color:#f3eee9;color:#211b17;font-family:Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3eee9;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" dir="rtl" width="100%" cellpadding="0" cellspacing="0" style="max-width:540px;text-align:right;">
          <tr>
            <td style="padding:24px;background-color:#201a16;border-radius:14px 14px 0 0;">
              <p style="margin:0 0 8px;color:#e6ad82;font-size:14px;font-weight:700;">Pentador</p>
              <h1 style="margin:0;color:#fffaf5;font-size:24px;line-height:1.3;">ליד חדש לתיאום התקנה</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 24px 24px;background-color:#fffaf5;border-radius:0 0 14px 14px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="table-layout:fixed;line-height:1.45;">
                ${rows}
              </table>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:22px;">
                <tr>
                  <td bgcolor="#d0874f" style="border-radius:8px;mso-padding-alt:13px 22px;">
                    <a href="tel:${callNumber}" style="display:inline-block;padding:13px 22px;color:#211b17;font-size:16px;font-weight:700;line-height:20px;text-decoration:none;">התקשרו לליד</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}

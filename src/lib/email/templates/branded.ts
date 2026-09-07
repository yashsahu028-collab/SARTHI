/**
 * Branded Email Template for Tech Tomorrow — Premium Version
 * Matches the green-on-white institutional design used in certificate/announcement emails.
 */

export interface BrandedEmailOptions {
  /** Badge pill text, e.g. "CERTIFICATE UPDATE" */
  badge?: string;
  /** Large heading, usually the email subject */
  heading: string;
  /** Plain-text or simple HTML body — newlines preserved */
  body: string;
  /** Optional highlighted callout box below the body */
  highlight?: string;
  /** Optional CTA button */
  action?: { label: string; url: string };
  /** Sender name shown in the sign-off */
  senderName?: string;
}

export function getBrandedTemplate(opts: BrandedEmailOptions): string {
  const {
    badge,
    heading,
    body,
    highlight,
    action,
    senderName = 'Tech Tomorrow Team',
  } = opts;

  // Parse Markdown headers (###, ##, #)
  let parsedBody = body || '';
  parsedBody = parsedBody.replace(/^### (.*$)/gim, '<h3 style="margin:20px 0 10px;font-size:18px;font-weight:700;color:#1f2937;">$1</h3>');
  parsedBody = parsedBody.replace(/^## (.*$)/gim, '<h2 style="margin:24px 0 12px;font-size:22px;font-weight:700;color:#1f2937;">$1</h2>');
  parsedBody = parsedBody.replace(/^# (.*$)/gim, '<h1 style="margin:28px 0 14px;font-size:26px;font-weight:700;color:#1f2937;">$1</h1>');

  // Parse Markdown bold (**text**) and italics (*text*)
  parsedBody = parsedBody.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
  parsedBody = parsedBody.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');

  // Format callouts or body highlight markdown cleanups if passed in highlight
  let cleanHighlight = highlight || '';
  cleanHighlight = cleanHighlight.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
  cleanHighlight = cleanHighlight.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');

  // Format paragraphs (split by double newlines) and inner newlines to <br>
  const formattedBody = parsedBody
    .split(/\r?\n\s*\r?\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .map(p => {
      if (p.startsWith('<h1') || p.startsWith('<h2') || p.startsWith('<h3')) {
        return p;
      }
      const htmlContent = p.replace(/\r?\n/g, '<br />');
      return `<p style="margin:0 0 16px;font-size:16px;line-height:1.8;color:#4b5563;">${htmlContent}</p>`;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${heading}</title>
</head>
<body style="margin:0;padding:0;background:#f8fbf8;font-family:'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fbf8;padding:50px 20px;">
<tr>
<td align="center">

<table width="680" cellpadding="0" cellspacing="0" style="
background:#ffffff;
border-radius:24px;
overflow:hidden;
box-shadow:0 20px 60px rgba(34,87,60,0.08);
">

<!-- Header -->
<tr>
<td style="
padding:55px 40px;
text-align:center;
background:linear-gradient(180deg,#ffffff,#f7fcf8);
border-bottom:1px solid #eef7f0;
">
<img src="https://techtomorrow.in/logo-tt-optimized.png"
     alt="Tech Tomorrow"
     width="80"
     style="display:block;margin:0 auto 20px auto;">
<h1 style="margin:0;font-size:38px;font-weight:700;color:#1f2937;letter-spacing:-1px;">
Tech Tomorrow
</h1>
<p style="margin:12px 0 0;font-size:16px;color:#64748b;">
Empowering Future Innovators
</p>
</td>
</tr>

<!-- Main Content -->
<tr>
<td style="padding:70px 60px;">

${badge ? `
<div style="
display:inline-block;
padding:8px 18px;
background:#eefbf2;
color:#2f855a;
border-radius:999px;
font-size:13px;
font-weight:600;
margin-bottom:30px;
letter-spacing:0.05em;
text-transform:uppercase;
">
${badge}
</div>
` : ''}

<h2 style="
margin:0 0 24px;
font-size:40px;
line-height:1.2;
font-weight:700;
color:#1f2937;
letter-spacing:-1px;
">
${heading}
</h2>

${formattedBody}

${cleanHighlight ? `
<div style="
background:linear-gradient(135deg,#f8fcf9,#eefbf2);
border:1px solid #d8f3dc;
border-radius:18px;
padding:24px;
margin:35px 0;
">
<p style="margin:0;font-size:15px;line-height:1.9;color:#4b5563;">
${cleanHighlight}
</p>
</div>
` : ''}

${action ? `
<div style="text-align:center;margin:45px 0;">
<a href="${action.url}"
style="
display:inline-block;
background:#57b26a;
color:#ffffff;
text-decoration:none;
padding:16px 38px;
border-radius:14px;
font-size:16px;
font-weight:600;
box-shadow:0 10px 25px rgba(87,178,106,0.20);
">
${action.label}
</a>
</div>
` : ''}

<p style="margin-top:45px;font-size:16px;line-height:1.8;color:#64748b;">
Warm regards,
</p>
<p style="margin-top:8px;font-size:16px;font-weight:700;color:#1f2937;">
${senderName}
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="
padding:35px;
text-align:center;
background:#fafdfb;
border-top:1px solid #eef7f0;
">
<p style="margin:0 0 10px;font-size:14px;color:#64748b;">
Building Skills. Creating Opportunities. Empowering Futures.
</p>
<p style="margin:0;font-size:13px;color:#94a3b8;">
&copy; 2026 Tech Tomorrow. All Rights Reserved.
</p>
</td>
</tr>

</table>
</td>
</tr>
</table>

</body>
</html>`;
}

type Mail = { to: string; subject: string; html: string };
export async function sendMail(mail: Mail) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!key || !from || !mail.to) return { skipped: true };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, ...mail })
  });
  if (!res.ok) console.error("Email error", await res.text());
  return { skipped: false, ok: res.ok };
}

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/email";
import { sendSms } from "@/lib/sms";
import { formatLocal } from "@/lib/time";

export async function POST() {
  if (!await getCurrentUser()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const now = Date.now();
  const from = new Date(now + 20 * 60 * 60 * 1000);
  const to = new Date(now + 28 * 60 * 60 * 1000);
  const appointments = await prisma.appointment.findMany({
    where: { startTime: { gte: from, lte: to }, reminderSentAt: null, status: { in: ["CONFIRMED", "CHECKED_IN"] } },
    include: { customer: true, vehicle: true, service: true }
  });

  for (const a of appointments) {
    const when = formatLocal(a.startTime);
    const message = `Falcon Auto Fix reminder: ${a.service?.name || "service"} for your ${a.vehicle.year} ${a.vehicle.make} ${a.vehicle.model} is scheduled for ${when}. Call (548) 689-9097 if you need to make a change.`;
    if (a.customer.email) await sendMail({ to: a.customer.email, subject: "Falcon Auto Fix — appointment reminder", html: `<h2>Appointment reminder</h2><p>${message}</p>` });
    await sendSms({ to: a.customer.phone, body: message });
    await prisma.appointment.update({ where: { id: a.id }, data: { reminderSentAt: new Date() } });
  }
  return NextResponse.json({ sent: appointments.length });
}

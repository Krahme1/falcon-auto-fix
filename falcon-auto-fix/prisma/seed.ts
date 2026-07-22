import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const services = [
  ["Oil Change", "oil-change", "Engine oil and filter replacement with a basic inspection.", 45],
  ["Brake Service & Repair", "brakes", "Brake inspection, pads, rotors, calipers and related repairs.", 90],
  ["Engine Diagnostics", "diagnostics", "Computer diagnostics and troubleshooting for warning lights and drivability issues.", 60],
  ["Tire Service", "tires", "Seasonal swaps, installation, balancing, repair and inspection.", 60],
  ["Wheel Alignment", "wheel-alignment", "Alignment inspection and adjustment for proper tire wear and handling.", 60],
  ["Steering & Suspension", "steering-suspension", "Inspection and repair of steering and suspension components.", 90],
  ["Air Conditioning", "air-conditioning", "A/C inspection, diagnosis and repair.", 60],
  ["Battery & Electrical", "battery-electrical", "Battery, starting, charging and electrical system diagnosis.", 60],
  ["Exhaust", "exhaust", "Exhaust system inspection and repair.", 75],
  ["Transmission", "transmission", "Transmission diagnosis, maintenance and repair consultation.", 90],
  ["Air & Cabin Filters", "filters", "Engine air filter and cabin air filter replacement.", 30],
  ["Other / Not Sure", "other", "Not sure what service you need? Describe the symptoms and we will help.", 60]
] as const;

async function main() {
  const email = process.env.ADMIN_EMAIL || "owner@falconautofix.ca";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, name: "Falcon Auto Fix", passwordHash }
  });

  for (const [name, slug, description, durationMinutes] of services) {
    await prisma.service.upsert({
      where: { slug },
      update: { name, description, durationMinutes, active: true },
      create: { name, slug, description, durationMinutes, sortOrder: services.findIndex(s => s[1] === slug) }
    });
  }

  const hours = [
    [0, false, "09:00", "17:00"],
    [1, true, "08:00", "20:00"],
    [2, true, "08:00", "20:00"],
    [3, true, "08:00", "20:00"],
    [4, true, "08:00", "20:00"],
    [5, true, "08:00", "20:00"],
    [6, true, "09:00", "18:00"]
  ] as const;
  for (const [dayOfWeek, isOpen, openTime, closeTime] of hours) {
    await prisma.businessHour.upsert({
      where: { dayOfWeek }, update: { isOpen, openTime, closeTime }, create: { dayOfWeek, isOpen, openTime, closeTime }
    });
  }
}

main().finally(() => prisma.$disconnect());

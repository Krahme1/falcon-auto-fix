# Falcon Auto Fix — Website + Booking + Owner Dashboard

Production-style starter for Falcon Auto Fix, 120 Falcon St, London, Ontario.

## Included
- Responsive marketing website
- Services page
- Five-step online appointment request flow
- Business-hour and service-duration based availability
- Double-booking prevention
- Customer, vehicle and appointment storage
- Secure owner login with signed HTTP-only session cookie
- Owner dashboard with counts and upcoming appointments
- Five-week calendar view
- Editable business hours and blocked-time closures
- Editable service durations / online availability
- Internal shop notes, estimates, invoice amounts and payment status
- Appointment status workflow: Pending → Confirmed → In Progress → Completed / Cancelled
- Customer CRM + completed service history
- Service catalog and duration management in the database
- Optional customer/owner email notifications via Resend
- PostgreSQL + Prisma schema and seed data
- Docker Compose local PostgreSQL

## Important booking rule
This app uses ONE shop schedule (no Bay 1 / Bay 2 / Bay 3). Any non-cancelled appointment blocks overlapping time. Service durations can differ.

## Local setup
1. Install Node.js 20+ and Docker Desktop.
2. Copy `.env.example` to `.env` and replace `SESSION_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
3. Start PostgreSQL:
   `docker compose up -d`
4. Install packages:
   `npm install`
5. Generate Prisma client:
   `npm run db:generate`
6. Create the database migration:
   `npx prisma migrate dev --name init`
7. Seed the owner account, services and hours:
   `npm run db:seed`
8. Start:
   `npm run dev`
9. Open `http://localhost:3000` and `http://localhost:3000/admin`.

## Production deployment
Recommended: Vercel + managed PostgreSQL (Neon, Supabase, Prisma Postgres, or another provider). Set all `.env.example` values in the hosting environment, migrate the production DB, then seed once.

Current Next.js pin is 16.2.11 because the July 2026 Next.js security release specifically recommends 16.2.11 for Active LTS.

## Email
Set `RESEND_API_KEY` and a verified `RESEND_FROM`. Without them, booking still works; email sending is silently skipped.

## Before launch
- Confirm real business hours with the owner and update `prisma/seed.ts` / database.
- Replace placeholder owner email.
- Use a strong unique admin password and a random 32+ character session secret.
- Add the actual domain and verified email sender.
- Add privacy policy / terms appropriate for the business.
- Run a full end-to-end test on mobile and desktop.

## Deliberately not hard-wired
Payments and Google Calendar require the business's own Stripe/Google credentials and policy decisions. The database already has estimate, invoice and payment-status fields, so those can be connected without redesigning the core booking model.

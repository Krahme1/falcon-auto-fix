# 🔧 Falcon Auto Fix

A full-stack automotive service booking and management platform built for **Falcon Auto Fix**, an auto repair shop in London, Ontario.

The platform allows customers to view automotive services and book appointments online, while providing the shop with a secure administrative dashboard for managing appointments, manually booking customers, and blocking unavailable time slots.

## 🌐 Live Website

**Falcon Auto Fix:**  
https://falcon-auto-fix-omega.vercel.app/

## ✨ Features

### Customer Experience
- Online appointment booking
- Real-time service and time-slot selection
- Vehicle information collection
- Appointment confirmation
- Responsive mobile-friendly interface
- Shop contact information and social media integration

### Admin Dashboard
- Secure administrator authentication
- View upcoming customer appointments
- View customer and vehicle information
- Track requested automotive services
- Manually create appointments for phone and walk-in customers
- Block unavailable dates and time slots
- Prevent conflicting appointments
- Manage appointment availability

## 🛠️ Tech Stack

**Frontend**
- Next.js
- React
- TypeScript
- CSS

**Backend**
- Next.js API Routes
- Prisma ORM
- PostgreSQL

**Authentication**
- Secure admin sessions
- bcrypt password hashing
- JOSE

**Infrastructure**
- Vercel
- Neon PostgreSQL
- GitHub

## 🗄️ Database

The application uses PostgreSQL with Prisma ORM to manage:

- Users
- Customers
- Vehicles
- Services
- Appointments
- Appointment services
- Blocked time slots

The booking system validates appointment availability before creating a reservation to help prevent scheduling conflicts.

## 🔐 Admin System

The administrative portal allows Falcon Auto Fix staff to manage bookings separately from the public customer-facing website.

Administrators can:

- Review scheduled appointments
- Enter appointments received by phone or in person
- Reserve unavailable periods
- Manage the shop's daily schedule

Sensitive credentials and database connection information are stored using environment variables and are not committed to the repository.

## 🚀 Deployment

The application is deployed through Vercel with a Neon-hosted PostgreSQL database.

Production deployments are automatically triggered when changes are pushed to the `main` branch.

## 📍 Falcon Auto Fix

**120 Falcon St**  
London, Ontario N5W 4Z1

📞 (548) 689-9097  
📧 falconauto47@gmail.com  
📸 Instagram: @falcon.auto.fix

### QUALITY SERVICE. KEEPING YOU ON THE ROAD.

## 👨‍💻 Developer

Designed and developed by **Kareem Rahme**.

- GitHub: Krahme1
- LinkedIn: kareemrahme

---

Built for a real-world automotive repair business to streamline appointment scheduling and shop operations.

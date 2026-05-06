# 🚀 Full-Stack Developer Portfolio & Admin System

A high-performance, production-ready developer portfolio built with **Next.js**, **NestJS**, and **PostgreSQL**. This system features a completely dynamic frontend managed through a secure, feature-rich administration dashboard.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## ✨ Key Features

### 🌐 Public Portfolio
- **Dynamic Hero & About Sections**: Personalized content fetched directly from the database.
- **Interactive Skills Bento**: A beautiful, uniform grid of technical expertise with overflow handling.
- **Project Showcase**: Filtered project lists with deep-dive detail pages.
- **Responsive Blog**: SEO-optimized technical articles with reading time and category tags.
- **Smart Contact Form**: Integrated with Nodemailer for instant admin alerts and customer auto-replies.

### 🔐 Admin Dashboard (`/admin`)
- **Full Content Management**: Manage Projects, Blog Posts, and Skills with ease.
- **Dynamic Profile Settings**: Update your name, bio, stats, and social links instantly.
- **Integrated Image Upload**: Upload profile and about-me photos directly from your computer/phone.
- **Message Center**: A centralized hub to view and manage incoming contact requests.
- **Secure Authentication**: JWT-based secure login system.

---

## 🛠️ Technical Stack

**Frontend:**
- Next.js (App Router)
- React Query (Data Fetching)
- Framer Motion (Animations)
- Lucide React (Icons)
- Tailwind CSS (Styling)

**Backend:**
- NestJS (Node.js Framework)
- TypeORM (Database ORM)
- PostgreSQL (Relational Database)
- Multer (File Uploads)
- Nodemailer (Email Integration)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Docker (for PostgreSQL)

### 1. Clone the repository
```bash
git clone https://github.com/ProfHezzy/olawale.git
cd olawale
```

### 2. Start the Database
```bash
docker-compose up -d
```

### 3. Setup Backend
```bash
cd backend
npm install
# Update .env with your Gmail credentials for the contact form
npm run start:dev
```

### 4. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```

### 5. Seed Initial Data
To populate the database with default projects, skills, and a profile:
```bash
# Inside backend directory
npx ts-node src/seed.ts
```

---

## 📸 Admin Credentials
- **Login URL**: `http://localhost:3000/admin`
- **Default Username**: `admin`
- **Default Password**: `admin123`

---

## 📧 Contact & Support
Crafted with ❤️ by **Hezekiah Olawale Ojenike**.

- **Website**: [hezekiah.dev](https://hezekiah.dev)
- **GitHub**: [@ProfHezzy](https://github.com/ProfHezzy)
- **LinkedIn**: [Hezekiah Ojenike](https://linkedin.com/in/hezekiahojenike)

---
*This project is licensed under the MIT License.*

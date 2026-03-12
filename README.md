# InvenTrack - Modern Inventory Management 📦

![InvenTrack](https://img.shields.io/badge/Status-Active-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)

**InvenTrack** is a beautifully designed, full-stack inventory management system built with state-of-the-art web technologies. It is built natively on **TypeScript**, ensuring supreme type-safety, reliability, and developer experience across the entire stack.

From tracking products and managing categories, to handling dynamic suppliers and logging every inventory transaction, InvenTrack provides a seamless, powerful, and secure experience for modern businesses.

## ✨ Features

- **📊 Comprehensive Dashboard**: Get real-time metrics on total products, low stock alerts, active categories, and total suppliers.
- **🛡️ Secure Authentication**: Built-in credential-based authentication utilizing NextAuth.js.
- **📦 Product Management**: Full CRUD capabilities for your inventory items with integrated stock tracking.
- **🏷️ Categories & Suppliers**: Neatly organize your products and manage the vendors that supply them.
- **📜 Transaction History**: A robust ledger that logs all incoming and outgoing inventory changes.
- **📱 Responsive & Accessible**: A sleek, dark-themed UI that works flawlessly on desktop and mobile.

## 🏗️ Architecture & Tech Stack

This project is meticulously crafted with a completely Type-Safe architecture:

- **Frontend**: Next.js 15 (App Router), React 19, CSS Modules
- **Language**: **100% TypeScript**
- **Backend**: Next.js API Routes (Serverless)
- **Database**: SQLite
- **ORM**: Prisma Client (Fully Typed Database Access)
- **Authentication**: NextAuth.js

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and npm installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Annabdiyu/InvenTrack.git
   cd InvenTrack
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up the Database:**
   Generate the Prisma client and push the schema to SQLite.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Start exploring:**
   Open [http://localhost:3000](http://localhost:3000) in your browser. Use the login screen to access the protected dashboard route.

## 📂 Project Structure

- `src/app`: Contains the Next.js App Router pages, layouts, and API routes.
- `src/components`: Reusable, type-safe React components (Header, Sidebar, Layouts).
- `src/lib`: Core utilities including the Prisma singleton and NextAuth configurations.
- `prisma`: Database schema and SQLite database artifacts.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Annabdiyu/InvenTrack/issues).

---
*Built with ❤️ utilizing Next.js & TypeScript.*

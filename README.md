# Baking Tales - Premium Bakery & E-commerce Template

![Baking Tales Banner](public/hero-preview.png) *Add a nice screenshot here*

## Overview
**Baking Tales** is a high-performance, visually stunning e-commerce template designed specifically for modern bakeries, cafes, and artisanal food businesses. Built with **Next.js 16**, **Tailwind CSS 4**, and **Supabase**, it offers a seamless blend of aesthetic excellence and powerful functionality.

This template is production-ready, featuring a robust admin dashboard, dynamic product management, and a highly responsive design that looks perfect on every device.

## ✨ Key Features

### 🎨 Visual & UI/UX
*   **Cinematic Hero Section**: Immersive hero sequence with performance-optimized frame animation.
*   **Modern Design System**: Clean typography, elegant color palettes, and smooth framer-motion animations.
*   **Fully Responsive**: optimized for mobile (85vh hero), tablet, and desktop layouts.
*   **Glassmorphism Effects**: Premium UI details with backdrop blurs and gradients.

### 🛍️ E-commerce Functionality
*   **Dynamic Product Catalog**: Filter by categories (Cakes, Pastries, etc.) and tags.
*   **Product Details**: Size selection, price calculation, and rich descriptions.
*   **Dynamic Image Hosting**: Organized storage in specific buckets (`cake-images`, `pastry-images`, etc.).

### 🛠️ Admin Dashboard
*   **Secure Access**: Protected routes for admin usage.
*   **Product Management**: Create, Edit, and Delete products with ease.
*   **Smart Image Uploads**: Auto-selects the correct storage bucket and manages file paths intelligently.
*   **Role-Based Security**: Built-in Supabase RLS policies ensuring data safety.

## 🚀 Tech Stack

*   **Framework**: Next.js 16 (App Router)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS 4
*   **Database & Auth**: Supabase
*   **Animations**: Framer Motion
*   **Forms**: React Hook Form + Zod
*   **Icons**: Lucide React

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/baking-tales.git
cd baking-tales
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup (Supabase)
1.  Create a new Supabase project.
2.  Run the SQL scripts provided in the `sql/` folder (or root):
    *   `supabase_schema.sql`: Sets up tables (products, profiles, etc.).
    *   `setup_storage.sql` & `update_storage_policies.sql`: Creates storage buckets (`cake-images`, etc.) and policies.

### 4. Run Locally
```bash
npm run dev
```
Visit `http://localhost:3000` to see your bakery live!

## 🔧 Customization Guide

### Changing Branding
*   **Colors**: Edit `app/globals.css` (or `index.css`) to change CSS variables.
*   **Fonts**: configured in `app/layout.tsx`.

### Adding New Categories
1.  Update the `select` options in `components/admin/product-form.tsx`.
2.  Add a new bucket in Supabase if needed (and update policies).

## 📄 License
[Your License Choice] - e.g., Commercial, MIT, etc.

---
*Created with ❤️ by [Your Name]*

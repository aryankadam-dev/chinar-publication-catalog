# CHINAR PUBLICATION - Digital Marketing Catalog

A modern, responsive digital book catalog built with **Next.js 16**, **Tailwind CSS**, and **Supabase**. This platform is designed specifically for digital marketing — it acts as a digital storefront to display available educational materials and offline purchase instructions without handling e-commerce transactions or displaying prices.

## 🚀 Features

- **Public Catalog**: A fully responsive digital marketing view of all available books.
- **Dynamic Content**: Books can be sorted (Newest, Title A-Z) and filtered by category.
- **Offline Purchase Instructions**: Each book can have customized instructions directing users to your physical store or providing contact details.
- **Admin Dashboard**: A secure, authenticated area to manage (Create, Read, Update, Delete) the catalog inventory.
- **Security First**: Public registration is entirely disabled. Admin accounts can only be created directly via the Supabase database dashboard.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📋 Setup & Installation

### 1. Clone & Install
```bash
# Install dependencies
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory (or rename `.env.example` if it exists) and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Supabase Database & Storage Setup
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Navigate to the **SQL Editor**.
3. First, open the `scripts/001_create_books_table.sql` file in this repository, copy the contents, paste them into the editor, and click **Run**. This sets up the base `books` table and security policies.
4. Second, open the `scripts/002_add_image_and_details.sql` file, copy the contents, paste into a new editor window, and click **Run**.
5. This second script will add the new required metadata columns (`image_url`, `pages`, `language`, `format`), create a new Storage bucket named explicitly `book-covers`, and set up the precise Row Level Security (RLS) policies needed to allow admins to upload images.

---

## 🔐 Creating the Admin Account

For security reasons, the `/admin/signup` route is completely disabled in the code. To create an Admin account, you must do it directly in your Supabase project:

1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to the **Authentication** tab on the left sidebar.
3. Click on the **Users** section.
4. Click the **"Add user"** button in the top right corner and select **"Create new user"**.
5. Enter the desired Admin Email (e.g., `admin@chinar.com`) and a strong, secure Password.
6. Check the "Auto Confirm User" box to verify them immediately.
7. Click **"Create user"**.

You can now use these credentials to log into the `/admin` dashboard in the app.

---

## 💻 Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the public catalog.
Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to log in to the admin dashboard and start adding books!

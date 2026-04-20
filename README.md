# Anass Fadile - 3D Portfolio

Welcome to the 3D interactive portfolio of Anass Fadile, built with cutting-edge web technologies. This project showcases an immersive, interactive 3D web experience alongside seamless 2D UI elements. It features a complete backend for managing blogs, projects, and an AI chat assistant.

## 🌟 Comprehensive Feature List

### 🎨 Frontend & User Experience (UX)
- **Immersive 3D Experience:** Fully interactive 3D web environment built with [Three.js](https://threejs.org/).
- **Dynamic Animations:** High-performance micro-interactions and transitions powered by [GSAP](https://gsap.com/).
- **Modern UI Design:** Fully responsive, accessible, and beautifully styled with [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/).
- **AI Chat Assistant:** A smart chatbot integrated directly into the portfolio powered by **Google Gemini** & **Groq API**, capable of answering questions.
- **Toast Notifications:** A custom generic alert system for providing immediate feedback (e.g., success messages, error alerts).

### 📝 Content Management & Public Views
- **Projects Showcase:** Dedicated detail pages showcasing case studies and robust project tracking.
- **Full Blogging System:** An integrated blog platform where users can read articles, interact with content, and leave **comments & reactions**.
- **Contact Form Integration:** Users can reach out directly from the portfolio. It notifies the owner via Email utilizing the **Resend API**.
- **Custom 404 Error Page:** A uniquely designed catch-all page for unknown routes.

### 🛡️ Admin Dashboard & Backend
- **Secure Authentication:** JWT-based user authentication & session management, fortified by password hashing via **Bcryptjs**.
- **Admin Portal (`/admin`):** A protected backend UI giving full control to the portfolio owner.
  - **Manage Comments:** Approve, moderate, or remove comments left on the blog posts.
  - **Manage Contacts:** View and organize all inbound contact requests efficiently.
- **Serverless Database:** Utilizing **Turso DB (LibSQL / SQLite)** for persistent, highly-available storage of blog comments, user data, and contact logs.
- **API Security:** The Express.js backend is safeguarded with robust middleware including **Helmet**, **CORS**, and **Rate Limiting** to prevent abuse.

## 🛠️ Technology Stack

- **Frontend:** Vue 3, Three.js, GSAP, Tailwind CSS, Vue Router, Pinia, Lucide-Vue-Next
- **Backend:** Node.js, Express.js (ts-node / tsx), Security middlewares (Helmet, Rate Limiter)
- **Database:** LibSQL (Turso SQLite)
- **Services:** Google Gemini GenAI, Groq API, Resend
- **Language:** TypeScript

## ⚙️ Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

## 📦 Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <your-repo-url>
   cd portfolio-3d
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   - Create a `.env` file in the root directory:
     ```bash
     cp .env.example .env
     ```
   - Add all the required variables:
     ```env
     PORT=3000
     NODE_ENV=development

     # AI APIs
     GEMINI_API_KEY=your_gemini_api_key
     VITE_GROQ_API_KEY=your_groq_api_key

     # Emails & Notifications
     RESEND_API_KEY=your_resend_api_key
     RESEND_TEMPLATE_ID=your_resend_template_id

     # Database (Turso)
     TURSO_DATABASE_URL=your_turso_db_url
     TURSO_AUTH_TOKEN=your_turso_auth_token
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   This will start both the frontend Vite development server and the Express development server (via `tsx`).

5. **Build for production:**
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `/src`: Vue 3 frontend application source code.
- `/api`: Application API endpoints logic and express routes.
- `/backend`: Additional backend controllers, configurations, and core logic.
- `server.ts`: Express application entry point.
- `package.json`: Project metadata, dependencies, and NPM scripts.
- `vite.config.ts`: Vite configuration file.

## 📄 License

This project is open-source and available under the terms of the MIT License.

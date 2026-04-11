# Anass Fadile - 3D Portfolio

Welcome to the 3D interactive portfolio of Anass Fadile, built with cutting-edge web technologies. This project showcases an immersive, interactive 3D web experience alongside seamless 2D UI elements.

## 🚀 Features

- **3D Graphics:** Built using [Three.js](https://threejs.org/) for rendering and displaying 3D models and environments.
- **Frontend Framework:** Modern, reactive UI powered by [Vue 3](https://vuejs.org/) and the Composition API.
- **Animations:** Smooth, high-performance web animations powered by [GSAP](https://gsap.com/).
- **Styling:** Rapid UI development with [Tailwind CSS v4](https://tailwindcss.com/).
- **AI Integration:** Backend powered by an Express.js server integrating the [Google Gemini GenAI API](https://ai.google.dev/).
- **State Management:** Centralized state pattern provided by [Pinia](https://pinia.vuejs.org/).

## 🛠️ Technology Stack

- **Frontend:** Vue 3, Three.js, GSAP, Tailwind CSS, Vue Router, Pinia
- **Backend:** Node.js, Express, Google GenAI, tsx
- **Build Tool:** Vite
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
   - Copy the example `.env` file to `.env` or `.env.local`:
     ```bash
     cp .env.example .env
     ```
   - Add your Google Gemini API key to the `.env` file:
     ```env
     GEMINI_API_KEY=your_genai_api_key_here
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
- `/backend` or `/server.ts`: Express server handling the AI API and other backend tasks.
- `package.json`: Project metadata, dependencies, and NPM scripts.
- `vite.config.ts`: Vite configuration file.

## 📄 License

This project is open-source and available under the terms of the MIT License.

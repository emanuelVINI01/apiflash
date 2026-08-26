<div align="center">
  <img src="public/icon.svg" alt="apiFlash Logo" width="120" height="120" />
  <h1>apiFlash</h1>
  <p><strong>A modern, fast, and secure HTTP workbench for testing and exploring APIs directly from your browser.</strong></p>

  <p>
    <a href="https://github.com/emanuelVINI01/apiflash/actions/workflows/ci.yml"><img src="https://github.com/emanuelVINI01/apiflash/actions/workflows/ci.yml/badge.svg" alt="Build Status"></a>
    <a href="https://github.com/emanuelVINI01/apiflash/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License"></a>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.2.1-black?logo=next.js" alt="Next.js"></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css" alt="Tailwind CSS"></a>
  </p>

  <p>
    <a href="#features">Features</a> •
    <a href="#architecture--security">Architecture</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>

<div align="center"><img src="docs/main.png" alt="apiFlash workbench interface" width="900" /></div>

---

## ⚡ Overview

apiFlash is an intelligent HTTP client designed to streamline your API development and testing workflow. Built with modern web technologies, it provides a seamless experience for crafting requests, analyzing responses, and generating client code—supercharged by AI.

## ✨ Features

- **Intuitive Interface:** A clean, responsive UI for composing GET, POST, PUT, DELETE, and other HTTP requests.
- **AI-Powered Assistance:** Leverage Google's Gemini to automatically generate request bodies, headers, and analyze complex API responses.
- **Secure Internal Proxy:** Test local APIs safely with built-in Server-Side Request Forgery (SSRF) protection.
- **Code Export:** Export your crafted requests directly into multiple client languages (cURL, JavaScript/Fetch, Python, etc.).
- **Workspace & History:** Automatically saves your request history and workspace configurations for quick context switching.

## 🏗 Architecture & Security

This project follows a modular and secure architecture built on **Next.js 16.2.1**:

- **Clean Architecture:** The AI module (`src/modules/ai`) is strictly decoupled, abstracting away the underlying LLM providers, quota services, and prompt management.
- **Robust SSRF Protection:** The application's internal proxy employs strict IP validation and DNS resolution. This actively prevents malicious requests targeting `localhost`, loopback interfaces, or cloud provider metadata endpoints.
- **Type-Safe & Validated:** All API routes strictly validate incoming payloads using **Zod**, ensuring runtime safety.
- **Structured Logging:** Implements a custom JSON logger optimized for aggregation platforms like Datadog or CloudWatch.

## 🛠 Tech Stack

- **Framework:** [Next.js 16.2.1](https://nextjs.org/) (App Router)
- **UI & Styling:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), Framer Motion
- **Database & ORM:** PostgreSQL, [Prisma](https://www.prisma.io/)
- **Validation:** [Zod](https://zod.dev/)
- **AI Integration:** Google GenAI SDK (Gemini)
- **Authentication:** NextAuth (v5 beta)
- **Testing:** Vitest

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL running locally or in the cloud
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/emanuelVINI01/apiflash.git
   cd apiflash
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory based on the `.env.example` (or use the following template):
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/apiflash"
   GEMINI_API_KEY="your-gemini-api-key"
   NEXTAUTH_SECRET="your-random-secure-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Run Database Migrations:**
   ```bash
   npx prisma db push
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧪 Testing

We use Vitest for unit and integration testing. The test suite includes critical security validations, especially for the SSRF proxy protection.

To run the tests:
```bash
npm run test
```

## 🤝 Contributing

Contributions are welcome. Please read the [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before opening an issue or pull request.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

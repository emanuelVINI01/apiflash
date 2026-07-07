# apiFlash - HTTP Workbench

apiFlash is a modern, fast, and secure HTTP workbench for testing and exploring APIs directly from your browser. It features AI-powered tools for generating requests, analyzing responses, and exporting client code.

## Architecture & Security

This project follows a modular architecture built on **Next.js 14**, featuring:
- **Clean Architecture** for the AI module (`src/modules/ai`), abstracting providers (Gemini), Quota Services, and Prompts.
- **Robust SSRF Protection**: The internal proxy uses strict IP validation and DNS resolution to prevent attacks targeting localhost, loopback interfaces, or cloud metadata.
- **Zod Validation**: All API routes validate incoming payloads securely.
- **Structured Logging**: Using a custom JSON logger ready for Datadog or CloudWatch.

## Tech Stack
- Next.js 14 (App Router)
- React
- Prisma (PostgreSQL)
- Zod (Schema Validation)
- Tailwind CSS
- Vitest (Testing)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` variables:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/apiflash"
   GEMINI_API_KEY="your-gemini-key"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```
4. Run migrations:
   ```bash
   npx prisma db push
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

## Commands
- `npm run dev`: Start dev server
- `npm run build`: Build for production
- `npm run test`: Run Vitest tests
- `npm run lint`: Run ESLint

## Testing
We use Vitest. To execute the test suite (which includes security validations against SSRF):
```bash
npm run test
```

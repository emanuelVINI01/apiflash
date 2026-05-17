# apiFlash

apiFlash is a mobile-first HTTP workbench for testing REST endpoints directly from the browser. It focuses on the fast loop developers use every day: choose a method, enter a URL, add headers, format a JSON body, send the request and inspect the response.

## Short Description

Dracula-themed HTTP client built with Next.js, Framer Motion and Tailwind CSS. It includes a responsive request workbench, response inspector, reusable collections, browser-side request history and product documentation pages.

## Features

- Method selector for `GET`, `POST`, `PUT`, `PATCH` and `DELETE`.
- URL input with automatic `https://` normalization.
- Header editor with enabled/disabled rows.
- JSON body editor with validation, formatting and preview mode.
- Server-side proxy route to reduce browser CORS friction.
- Response viewer with status, duration, body, headers, syntax highlighting and copy action.
- Local browser history for successful requests.
- Collections page with reusable endpoint recipes.
- Docs page explaining request lifecycle and safety constraints.
- Mobile bottom navigation, responsive footer and Dracula theme.
- Framer Motion animations across hero, cards and workbench sections.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide React
- React Syntax Highlighter

## Pages

- `/` - main HTTP workbench.
- `/collections` - reusable request recipes and templates.
- `/history` - local request history saved in `localStorage`.
- `/docs` - request lifecycle, proxy behavior and safety notes.

## Project Structure

```txt
app/
  api/proxy/route.ts
  collections/page.tsx
  docs/page.tsx
  history/page.tsx
  page.tsx
src/components/
  AdvancedSettings.tsx
  AppChrome.tsx
  Footer.tsx
  HeadersEditor.tsx
  RequestBar.tsx
  RequestBodyEditor.tsx
  ResponseViewer.tsx
```

## Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Proxy Behavior

The UI sends requests to `POST /api/proxy`. The proxy receives:

- `url`
- `method`
- `headers`
- optional `body`

The server route performs the outbound request and returns normalized response metadata to the UI. This keeps the browser interface simple and avoids many CORS limitations that appear when calling third-party APIs directly from the client.

## Safety Notes

apiFlash does not persist secrets. Local history stores only method, URL, status, status text, duration and timestamp. Avoid sending production credentials through a public demo deployment unless you control the environment.

## License

No open-source license is declared yet.

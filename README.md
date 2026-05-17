# apiFlash

apiFlash is a mobile-first HTTP workbench for testing REST endpoints directly from the browser. It focuses on the fast loop used every day: choose a method, enter a URL, add params, auth, headers and body, send the request and inspect the response.

## Short Description

HTTP client with a responsive request workbench, response inspector, reusable collections, browser-side request history and product documentation pages.

## Features

- Method selector for `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD` and `OPTIONS`.
- URL input with automatic `https://` normalization.
- Query parameter editor with enabled/disabled rows.
- Auth helpers for bearer token, basic auth and API key.
- Header editor with enabled/disabled rows.
- JSON, text and form URL encoded body modes.
- JSON body validation, formatting and preview.
- Timeout and redirect controls.
- Generated cURL preview for the current request.
- Server-side request proxy to reduce browser CORS friction.
- Response viewer with status, duration, body, headers and copy action.
- Local browser history for successful requests.
- Persistent local collections with saved requests that can be run again.
- Language toggle for Portuguese and English.

## Pages

- `/` - main HTTP workbench.
- `/collections` - local collections with saved requests.
- `/history` - local request history saved in `localStorage`.
- `/docs` - request lifecycle, proxy behavior and safety notes.

## Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Proxy Behavior

The UI sends requests to `POST /api/proxy`. The proxy receives:

- `url`
- `method`
- `headers`
- optional `body`
- optional `timeoutMs`
- optional `followRedirects`

The server route performs the outbound request and returns normalized response metadata to the UI. This keeps the browser interface simple and avoids many CORS limitations that appear when calling third-party APIs directly from the client.

## Safety Notes

apiFlash does not send local history or collections to an external account. Data saved in history and collections stays in the current browser. Avoid saving production credentials in a public demo deployment unless you control the environment.

## License

No open-source license is declared yet.

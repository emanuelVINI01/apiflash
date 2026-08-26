// Illustrative example values for the landing-page mock terminal / preview cards.
// These are not live platform metrics — apiFlash is a request/response workbench,
// not an uptime monitoring product.

export const savedRequestsPreview = [
  { endpoint: "GET /v1/checkout", status: "200 OK", latency: "99ms", colorClass: "bg-dracula-green" },
  { endpoint: "POST /v1/webhooks", status: "429", latency: "391ms", colorClass: "bg-dracula-yellow" },
  { endpoint: "GET /health", status: "200 OK", latency: "48ms", colorClass: "bg-dracula-cyan" },
] as const;

export const savedFlowsPreview = [
  { label: "checkout", value: "100%", widthClass: "w-full", colorClass: "bg-dracula-green" },
  { label: "auth", value: "92%", widthClass: "w-[92%]", colorClass: "bg-dracula-cyan" },
  { label: "webhooks", value: "78%", widthClass: "w-[78%]", colorClass: "bg-dracula-yellow" },
  { label: "health", value: "100%", widthClass: "w-full", colorClass: "bg-dracula-green" },
] as const;

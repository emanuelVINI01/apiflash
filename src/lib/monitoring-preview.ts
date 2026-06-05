export const heroMonitorPreview = [
  { endpoint: "GET /v1/checkout", stateKey: "operational", latency: "99ms", colorClass: "bg-dracula-green" },
  { endpoint: "POST /v1/webhooks", stateKey: "degraded", latency: "391ms", colorClass: "bg-dracula-yellow" },
  { endpoint: "GET /health", stateKey: "operational", latency: "48ms", colorClass: "bg-dracula-cyan" },
] as const;

export const regionHealthPreview = [
  { label: "us-east", value: "99.99%", widthClass: "w-[96%]", colorClass: "bg-dracula-green" },
  { label: "us-west", value: "99.97%", widthClass: "w-[91%]", colorClass: "bg-dracula-cyan" },
  { label: "sa-east", value: "98.84%", widthClass: "w-[74%]", colorClass: "bg-dracula-yellow" },
  { label: "eu-west", value: "99.95%", widthClass: "w-[88%]", colorClass: "bg-dracula-green" },
] as const;

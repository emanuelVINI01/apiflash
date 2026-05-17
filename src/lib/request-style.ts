export function methodClass(method: string) {
  if (method === "GET") return "border-dracula-cyan/25 bg-dracula-cyan/10 text-dracula-cyan";
  if (method === "POST") return "border-dracula-green/25 bg-dracula-green/10 text-dracula-green";
  if (method === "DELETE") return "border-dracula-red/25 bg-dracula-red/10 text-dracula-red";
  if (method === "PUT") return "border-dracula-orange/25 bg-dracula-orange/10 text-dracula-orange";
  if (method === "PATCH") return "border-dracula-purple/25 bg-dracula-purple/10 text-dracula-purple";
  return "border-dracula-yellow/25 bg-dracula-yellow/10 text-dracula-yellow";
}

export function statusClass(status: number) {
  if (status >= 200 && status < 300) return "border-dracula-green/30 bg-dracula-green/10 text-dracula-green";
  if (status >= 400) return "border-dracula-red/30 bg-dracula-red/10 text-dracula-red";
  return "border-dracula-cyan/30 bg-dracula-cyan/10 text-dracula-cyan";
}

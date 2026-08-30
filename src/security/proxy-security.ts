import * as net from "net";
import dns from "dns/promises";

const BANNED_IPS = [
  "127.0.0.1",
  "::1",
  "169.254.169.254", // AWS Metadata
  "169.254.169.253", // AWS Metadata
];

// Subnets to block: 127.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16,
// fe80::/10 (IPv6 link-local), fc00::/7 (IPv6 ULA), plus IPv4-mapped IPv6
// addresses (::ffff:a.b.c.d), which are unwrapped and re-checked as IPv4.
function isPrivateIp(ip: string): boolean {
  const type = net.isIP(ip);
  if (!type) return false;

  if (type === 4) {
    if (ip.startsWith("127.")) return true;
    if (ip.startsWith("10.")) return true;
    if (ip.startsWith("192.168.")) return true;

    if (ip.startsWith("172.")) {
      const secondOctet = parseInt(ip.split(".")[1], 10);
      if (secondOctet >= 16 && secondOctet <= 31) return true;
    }

    return false;
  }

  const lower = ip.toLowerCase();

  const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped) {
    const inner = mapped[1];
    return BANNED_IPS.includes(inner) || isPrivateIp(inner);
  }

  // fe80::/10 (link-local): first hextet feX0-feXf where X in 8,9,a,b.
  if (/^fe[89ab][0-9a-f]:/.test(lower)) return true;

  // fc00::/7 (unique local): first hextet starts with fc or fd.
  if (/^f[cd][0-9a-f]{2}:/.test(lower)) return true;

  return false;
}

export interface ProxyUrlValidation {
  url: string;
  ip: string;
}

export async function validateProxyUrlSecurity(urlStr: string): Promise<ProxyUrlValidation | null> {
  try {
    const url = new URL(urlStr);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    const hostname = url.hostname;

    if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.endsWith(".local")) {
      return null;
    }

    try {
      // Resolve DNS to prevent DNS Rebinding and Hex IP bypass. The resolved
      // IP is returned so callers can pin the real fetch to it, closing the
      // TOCTOU window between this validation and the actual request.
      const resolved = await dns.lookup(hostname);
      const ip = resolved.address;

      if (BANNED_IPS.includes(ip) || isPrivateIp(ip) || BANNED_IPS.includes(hostname)) {
        return null;
      }

      return { url: url.toString(), ip };
    } catch {
      // If DNS resolution fails, block it to be safe
      return null;
    }
  } catch {
    return null;
  }
}

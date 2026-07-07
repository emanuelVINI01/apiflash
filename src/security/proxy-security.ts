import * as net from "net";
import dns from "dns/promises";

const BANNED_IPS = [
  "127.0.0.1",
  "::1",
  "169.254.169.254", // AWS Metadata
  "169.254.169.253", // AWS Metadata
];

// Subnets to block: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
function isPrivateIp(ip: string): boolean {
  if (!net.isIP(ip)) return false;
  
  if (ip.startsWith("10.")) return true;
  if (ip.startsWith("192.168.")) return true;
  
  if (ip.startsWith("172.")) {
    const secondOctet = parseInt(ip.split(".")[1], 10);
    if (secondOctet >= 16 && secondOctet <= 31) return true;
  }
  
  return false;
}

export async function validateProxyUrlSecurity(urlStr: string): Promise<string | null> {
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
      // Resolve DNS to prevent DNS Rebinding and Hex IP bypass
      const resolved = await dns.lookup(hostname);
      const ip = resolved.address;
      
      if (BANNED_IPS.includes(ip) || isPrivateIp(ip) || BANNED_IPS.includes(hostname)) {
        return null;
      }
    } catch {
      // If DNS resolution fails, block it to be safe
      return null;
    }
    
    return url.toString();
  } catch {
    return null;
  }
}

import { describe, it, expect } from 'vitest';
import { validateProxyUrlSecurity } from '../proxy-security';

describe('validateProxyUrlSecurity', () => {
  it('should block localhost', async () => {
    expect(await validateProxyUrlSecurity('http://localhost:3000')).toBeNull();
    expect(await validateProxyUrlSecurity('http://127.0.0.1:5432')).toBeNull();
  });

  it('should block the entire 127.0.0.0/8 loopback range, not just 127.0.0.1', async () => {
    expect(await validateProxyUrlSecurity('http://127.0.0.2/')).toBeNull();
    expect(await validateProxyUrlSecurity('http://127.255.255.255/')).toBeNull();
  });

  it('should block AWS metadata', async () => {
    expect(await validateProxyUrlSecurity('http://169.254.169.254/latest/meta-data')).toBeNull();
  });

  it('should block private networks', async () => {
    expect(await validateProxyUrlSecurity('http://10.0.0.1/api')).toBeNull();
    expect(await validateProxyUrlSecurity('http://192.168.1.1/admin')).toBeNull();
    expect(await validateProxyUrlSecurity('http://172.16.0.5/test')).toBeNull();
  });

  it('should block private/loopback/link-local IPv6 addresses', async () => {
    expect(await validateProxyUrlSecurity('http://[::1]/')).toBeNull();
    expect(await validateProxyUrlSecurity('http://[fe80::1]/')).toBeNull();
    expect(await validateProxyUrlSecurity('http://[fc00::1]/')).toBeNull();
    expect(await validateProxyUrlSecurity('http://[fd12::1]/')).toBeNull();
  });

  it('should block IPv4-mapped IPv6 addresses pointing at private/metadata IPs', async () => {
    expect(await validateProxyUrlSecurity('http://[::ffff:127.0.0.1]/')).toBeNull();
    expect(await validateProxyUrlSecurity('http://[::ffff:169.254.169.254]/')).toBeNull();
    expect(await validateProxyUrlSecurity('http://[::ffff:10.0.0.1]/')).toBeNull();
  });

  it('should allow public domains and return the resolved IP', async () => {
    const githubResult = await validateProxyUrlSecurity('https://api.github.com');
    expect(githubResult?.url).toBe('https://api.github.com/');
    expect(githubResult?.ip).toBeTruthy();

    const exampleResult = await validateProxyUrlSecurity('http://example.com/test?q=1');
    expect(exampleResult?.url).toBe('http://example.com/test?q=1');
    expect(exampleResult?.ip).toBeTruthy();
  });

  it('should block non-http protocols', async () => {
    expect(await validateProxyUrlSecurity('file:///etc/passwd')).toBeNull();
    expect(await validateProxyUrlSecurity('ftp://example.com')).toBeNull();
  });
});

import { describe, it, expect } from 'vitest';
import { validateProxyUrlSecurity } from '../proxy-security';

describe('validateProxyUrlSecurity', () => {
  it('should block localhost', async () => {
    expect(await validateProxyUrlSecurity('http://localhost:3000')).toBeNull();
    expect(await validateProxyUrlSecurity('http://127.0.0.1:5432')).toBeNull();
  });

  it('should block AWS metadata', async () => {
    expect(await validateProxyUrlSecurity('http://169.254.169.254/latest/meta-data')).toBeNull();
  });

  it('should block private networks', async () => {
    expect(await validateProxyUrlSecurity('http://10.0.0.1/api')).toBeNull();
    expect(await validateProxyUrlSecurity('http://192.168.1.1/admin')).toBeNull();
    expect(await validateProxyUrlSecurity('http://172.16.0.5/test')).toBeNull();
  });

  it('should allow public domains', async () => {
    expect(await validateProxyUrlSecurity('https://api.github.com')).toBe('https://api.github.com/');
    expect(await validateProxyUrlSecurity('http://example.com/test?q=1')).toBe('http://example.com/test?q=1');
  });

  it('should block non-http protocols', async () => {
    expect(await validateProxyUrlSecurity('file:///etc/passwd')).toBeNull();
    expect(await validateProxyUrlSecurity('ftp://example.com')).toBeNull();
  });
});

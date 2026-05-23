import { URL } from 'url';

// SSRF Protection: block private and loopback IP ranges
const isPrivateIp = (hostname) => {
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return true;
  }
  
  if (
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('169.254.')
  ) {
    return true;
  }
  
  if (hostname.startsWith('172.')) {
    const parts = hostname.split('.');
    if (parts.length >= 2) {
      const secondOctet = parseInt(parts[1], 10);
      if (secondOctet >= 16 && secondOctet <= 31) {
        return true;
      }
    }
  }
  
  return false;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { role, params, payload } = req.body;

  let url;
  if (role === 'professor') {
    url = process.env.WEBHOOK_PROFESSOR;
  } else if (role === 'admin') {
    url = process.env.WEBHOOK_ADMIN;
  } else {
    url = process.env.WEBHOOK_STUDENT;
  }

  if (!url) {
    return res.status(500).json({ error: 'Webhook URL is not configured on the server.' });
  }

  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return res.status(400).json({ error: 'Invalid target protocol. Only HTTP and HTTPS are allowed.' });
    }

    if (isPrivateIp(parsedUrl.hostname)) {
      return res.status(403).json({ error: 'Access to private or local network addresses is forbidden.' });
    }

    // Build the query string parameters if any
    const separator = url.includes('?') ? '&' : '?';
    let targetUrl = url;
    if (params) {
      const queryStr = Object.entries(params)
        .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(val))}`)
        .join('&');
      if (queryStr) {
        targetUrl = `${url}${separator}${queryStr}`;
      }
    }

    console.log(`[Proxy] Forwarding request to: ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    res.status(response.status);

    try {
      const responseData = JSON.parse(responseText);
      return res.json(responseData);
    } catch {
      return res.send(responseText);
    }
  } catch (err) {
    console.error('[Proxy] Webhook forwarding error:', err);
    return res.status(500).json({
      error: 'Failed to deliver webhook payload',
      details: err.message
    });
  }
}

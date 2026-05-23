import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse json and urlencoded data
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API proxy endpoint to avoid CORS and mixed content issues
  app.post('/api/proxy-webhook', async (req, res) => {
    const { role, params, payload } = req.body;

    let targetWebhookUrl = null;
    if (role === 'professor') {
      targetWebhookUrl = process.env.WEBHOOK_PROFESSOR;
    } else if (role === 'admin') {
      targetWebhookUrl = process.env.WEBHOOK_ADMIN;
    } else {
      targetWebhookUrl = process.env.WEBHOOK_STUDENT;
    }

    if (!targetWebhookUrl) {
      return res.status(500).json({ error: 'Webhook URL is not configured on the local server.' });
    }

    const url = targetWebhookUrl;

    try {
      // Build the target URL with query params
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

      console.log(`[Proxy] Forwarding request to target webhook URL: ${targetUrl}`);

      // Forward request using standard backend node fetch
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
          // Bypass Ngrok warning pages and browser blocks
          'ngrok-skip-browser-warning': 'true',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      console.log(`[Proxy] Target webhook responded with status ${response.status}`);

      // Return status corresponding to the hook response
      res.status(response.status);

      // Try parsing response content, return standard format
      try {
        const responseData = JSON.parse(responseText);
        res.json(responseData);
      } catch {
        res.send(responseText);
      }
    } catch (err: any) {
      console.error('[Proxy] Error calling webhook:', err);
      res.status(500).json({
        error: 'Failed to deliver webhook payload from proxy server',
        details: err.message
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

// Vercel Serverless Function - Health Check
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok', 
    message: 'GitHub Copilot CLI Guide API is running',
    timestamp: new Date().toISOString(),
    environment: 'vercel'
  });
}

// api/index.js
import { ogmp3 } from '../utils/downloader.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow GET and POST requests
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ 
      status: false, 
      code: 405, 
      message: 'Method not allowed' 
    });
  }
  
  // Extract parameters (supports both GET and POST)
  const params = req.method === 'POST' ? req.body : req.query;
  const { url, format, type = 'video' } = params;
  
  // Validate URL parameter
  if (!url) {
    return res.status(400).json({
      status: false,
      code: 400,
      message: 'URL parameter is required'
    });
  }
  
  try {
    // Process the download request
    const result = await ogmp3.download(url, format, type);
    
    // Return the appropriate response
    return res.status(result.status ? 200 : result.code).json(result);
  } catch (error) {
    // Handle unexpected errors
    return res.status(500).json({
      status: false,
      code: 500,
      message: 'Server error',
      error: error.message
    });
  }
}

// api/proxy.js
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  // Log the URL to see what path is being accessed
  console.log('Request URL:', req.url);

  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow your specific origin
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Authorization, Content-Type, Accept, Origin, Userid'
  );

  // Handle preflight requests for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end(); // Respond with a 200 OK status for preflight checks
    return;
  }

  let url = '';
  let body = {};
  let headers = {
    'Content-Type': 'application/json',
  };

  // Strip out the '/api/proxy' part of the URL if it exists, to properly map routes
  // const path = req.url.replace('/api/proxy', '');
  const path = req.url.replace(/\/api\/proxy\/|\?.*/g, '');

  // Determine the request path and handle accordingly
  switch (path) {
    case 'pdf': {
      // Handle the Google Drive PDF request
      const fileId = req.query.id;
      url = `https://drive.google.com/uc?export=download&id=${fileId}`;
      headers = { 'Content-Type': 'application/pdf' }; // Reset headers for PDF response
      break;
    }
    case 'video': {
      const fileId = req.query.id;
      url = `https://drive.google.com/uc?export=download&id=${fileId}`;
      headers = { 'Content-Type': 'video/mp4' };
      break;
    }
    case 'signup':
      // url = 'https://childbehaviorcheckin.com/back/users';
      url = 'http://165.227.154.82:30007/back/users';
      body = {
        email_id: req.body.email_id,
        password: req.body.password,
        plan_name: req.body.plan_name,
      };
      break;

    case 'login':
      // url = 'https://childbehaviorcheckin.com/back/users/login';
      url = 'http://165.227.154.82:30007/back/users/login';
      body = {
        email_id: req.body.email_id,
        password: req.body.password,
        machine_id: req.body.machine_id,
      };
      break;

    case 'google-login':
      // url = 'https://childbehaviorcheckin.com/back/users/google';
      url = 'http://165.227.154.82:30007/back/users/google';
      body = {
        email_id: req.body.email_id,
        plan_name: req.body.plan_name || 'free',
        machine_id: req.body.machine_id,
      };
      break;

    case 'history':
      // url = 'https://childbehaviorcheckin.com/back/history';
      url = 'http://165.227.154.82:30007/back/history';
      body = {
        _id: "6593bc7a65e63b8aec728732",
        question: req.body.question,
        status: "complete",
        response: req.body.response,
        machine_id: req.body.machine_id,
        chat_id: req.body.chat_id,
      };
      headers['userid'] = req.headers.userid;
      break;

    case 'history/delete':
      url = 'https://childbehaviorcheckin.com/back/history/delete';
      body = {}; // No request body as per your specification
      headers['userid'] = req.headers.userid;
      break;

    case 'history/get':
      // url = 'https://childbehaviorcheckin.com/back/history/get';
      url = 'http://165.227.154.82:30007/back/history/get';
      body = {
        _id: "6593bc7a65e63b8aec728732",
      };
      headers['userid'] = req.headers.userid; // Add 'userid' header only for history/get
      break;

    default:
      console.log(`Unmatched path: ${path}`); // Log the unmatched path
      res.status(404).json({ message: 'Endpoint not found', unmatchedPath: path });
      return;
  }

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: headers,
      body: path !== 'pdf' && path !== 'video' ? JSON.stringify(body) : undefined,
    });

    if (path === 'pdf' || path === 'video') {
      // Use arrayBuffer instead of buffer
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      res.setHeader('Content-Type', headers['Content-Type']);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).send(buffer);
    } else {
      const data = await response.json();

      // Set CORS headers for the actual response
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader('Access-Control-Allow-Origin', '*'); // Replace with specific origin
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Authorization, Content-Type, Accept, Origin, Userid'
      );

      res.status(response.status).json(data);
    }
  } catch (error) {
    // Set CORS headers for errors as well
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace with specific origin
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Authorization, Content-Type, Accept, Origin, Userid'
    );

    res.status(500).json({ error: 'Failed to fetch data', details: error.message  });
  }
}

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
  const path = req.url.replace('/api/proxy', '');

  // Determine the request path and handle accordingly
  switch (path) {
    case '/signup':
      url = 'https://childbehaviorcheckin.com/back/users';
      body = {
        email_id: req.body.email_id,
        password: req.body.password,
        plan_name: req.body.plan_name,
      };
      break;

    case '/login':
      url = 'https://childbehaviorcheckin.com/back/users/login';
      body = {
        email_id: req.body.email_id,
        password: req.body.password,
        machine_id: req.body.machine_id,
      };
      break;

    case '/google-login':
      url = 'https://childbehaviorcheckin.com/back/users/google';
      body = {
        email_id: req.body.email_id,
        plan_name: req.body.plan_name || 'free',
        machine_id: req.body.machine_id,
      };
      break;

    case '/history':
      url = 'https://childbehaviorcheckin.com/back/history';
      body = {
        _id: req.body._id,
        question: req.body.question,
        status: req.body.status || 'complete',
        response: req.body.response,
        machine_id: req.body.machine_id,
        chat_id: uuidv4(),
      };
      headers['Userid'] = req.headers.Userid;
      break;

    case '/history/delete':
      url = 'https://childbehaviorcheckin.com/back/history/delete';
      body = {}; // No request body as per your specification
      headers['Userid'] = req.headers.Userid;
      break;

    case '/history/get':
      url = 'https://childbehaviorcheckin.com/back/history/get';
      body = {
        _id: req.body._id,
      };
      headers['userId'] = req.headers.userId; // Add 'userid' header only for history/get
      break;

    default:
      res.status(404).json({ message: 'Endpoint not found' });
      return;
  }

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Set CORS headers for the actual response
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace with specific origin
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Authorization, Content-Type, Accept, Origin, Userid'
    );

    res.status(response.status).json(data);
  } catch (error) {
    // Set CORS headers for errors as well
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace with specific origin
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Authorization, Content-Type, Accept, Origin, Userid'
    );

    res.status(500).json({ error: 'Failed to fetch data' });
  }
}

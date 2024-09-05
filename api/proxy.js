// api/proxy.js

import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  // Handle preflight requests for CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace * with specific origin if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Authorization, Content-Type, Accept, Origin'
    );
    res.status(200).end();
    return;
  }

  let url = '';
  let body = {};

  // Determine the request path and handle accordingly
  switch (req.url) {
    case '/api/proxy/signup':
      url = 'https://childbehaviorcheckin.com/back/users';
      body = {
        email_id: req.body.email_id,
        password: req.body.password,
        plan_name: req.body.plan_name,
      };
      break;

    case '/api/proxy/login':
      url = 'https://childbehaviorcheckin.com/back/users/login';
      body = {
        email_id: req.body.email_id,
        password: req.body.password,
        machine_id: req.body.machine_id,
      };
      break;

    case '/api/proxy/google-login':
      url = 'https://childbehaviorcheckin.com/back/users/google';
      body = {
        email_id: req.body.email_id,
        plan_name: req.body.plan_name || "free",
        machine_id: req.body.machine_id,
      };
      break;

    case '/api/proxy/history':
      url = 'https://childbehaviorcheckin.com/back/history';
      body = {
        _id: req.body._id,
        question: req.body.question,
        status: req.body.status || "complete",
        response: req.body.response,
        machine_id: req.body.machine_id,
        chat_id: uuidv4(),
      };
      break;

    case '/api/proxy/history/delete':
      url = 'https://childbehaviorcheckin.com/back/history/delete';
      body = {}; // No request body as per your specification
      break;

    case '/api/proxy/history/get':
      url = 'https://childbehaviorcheckin.com/back/history/get';
      body = {
        _id: req.body._id,
      };
      break;

    default:
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Authorization, Content-Type, Accept, Origin'
      );
      res.status(404).json({ message: 'Endpoint not found' });
      return;
  }

  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Authorization, Content-Type, Accept, Origin'
    );

    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}

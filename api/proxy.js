import axios from 'axios';

export default async function handler(req, res) {
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

  // Extract the base path without query parameters
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
    case 'signup':
      url = 'https://childbehaviorcheckin.com/back/users';
      body = {
        email_id: req.body.email_id,
        password: req.body.password,
        plan_name: req.body.plan_name,
      };
      break;

    case 'login':
      url = 'https://childbehaviorcheckin.com/back/users/login';
      body = {
        email_id: req.body.email_id,
        password: req.body.password,
        machine_id: req.body.machine_id,
      };
      break;

    case 'google-login':
      url = 'https://childbehaviorcheckin.com/back/users/google';
      body = {
        email_id: req.body.email_id,
        plan_name: req.body.plan_name || 'free',
        machine_id: req.body.machine_id,
      };
      break;

    case 'history':
      url = 'https://childbehaviorcheckin.com/back/history';
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
      url = 'https://childbehaviorcheckin.com/back/history/get';
      body = {
        _id: "6593bc7a65e63b8aec728732",
      };
      headers['userid'] = req.headers.userid;
      break;

    default:
      console.log(`Unmatched path: ${path}`); // Log the unmatched path
      res.status(404).json({ message: 'Endpoint not found' });
      return;
  }

  try {
    const response = await axios({
      url,
      method: req.method,
      headers,
      data: path !== 'pdf' ? body : undefined,
      responseType: path === 'pdf' ? 'arraybuffer' : 'json', // Handle binary data for PDF
    });

    if (path === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.status(200).send(response.data); // Send the PDF binary data
    } else {
      res.status(response.status).json(response.data); // Send JSON response for other cases
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

    res.status(500).json({ error: 'Failed to fetch data' });
  }
}

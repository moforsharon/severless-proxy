const axios = require('axios');
const querystring = require('querystring');

module.exports = async (req, res) => {
  const targetUrl = 'https://childbehaviorcheckin.com';

  // Handle preflight (OPTIONS) request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Userid');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.status(200).end(); // Respond with 200 for preflight
    return;
  }

  // Parse the incoming request URL to get the query parameters
  const queryParams = querystring.stringify(req.query);

  // Ensure req.path exists, and append a leading slash if necessary
  const path = req.path.startsWith('/') ? req.path : `/${req.path}`;
  
  const targetFullUrl = `${targetUrl}${path}${queryParams ? `?${queryParams}` : ''}`;

  console.log(`Proxying request to: ${targetFullUrl}`);
  console.log(`Method: ${req.method}`);
  console.log(`Headers: ${JSON.stringify(req.headers)}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);

  try {
    const response = await axios({
      method: req.method,
      url: targetFullUrl, // Use the constructed URL
      headers: {
        ...req.headers,
        host: new URL(targetUrl).host,
      },
      data: req.body // Only pass this if the request is a POST or PUT, not for GET
    });

    // Handle successful response
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Userid');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.status(response.status).json(response.data);

  } catch (error) {
    console.error("Proxy error:", error.message); // Log the error to debug
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

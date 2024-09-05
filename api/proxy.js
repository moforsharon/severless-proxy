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

  try {
    const response = await axios({
      method: req.method,
      url: `${targetUrl}${req.path}?${queryParams}`,
      headers: {
        ...req.headers,
        host: new URL(targetUrl).host
      },
      data: req.body
    });

    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Userid');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

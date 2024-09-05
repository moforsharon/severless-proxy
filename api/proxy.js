// api/proxy.js

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

  if (req.method === 'POST') {
    try {
      const response = await fetch('https://childbehaviorcheckin.com/back/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_id: req.body.email_id,
          password: req.body.password,
          plan_name: req.body.plan_name,
        }),
      });

      const data = await response.json();

      // Set CORS headers
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader('Access-Control-Allow-Origin', '*'); // Replace * with specific origin if needed
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Authorization, Content-Type, Accept, Origin'
      );

      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace * with specific origin if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Authorization, Content-Type, Accept, Origin'
    );
    res.status(405).json({ message: 'Only POST method is allowed' });
  }
}

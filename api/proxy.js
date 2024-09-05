// api/proxy.js

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const response = await fetch('https://childbehaviorcheckin.com/back/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_id: req.body.email_id,
        password: req.body.password,
        plan_name: req.body.plan_name
      }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } else {
    res.status(405).json({ message: 'Only POST method is allowed' });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { device_code } = req.body;

  if (!device_code) {
    return res.status(400).json({ error: 'device_code ausente' });
  }

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id:   process.env.GITHUB_CLIENT_ID,
      device_code,
      grant_type:  'urn:ietf:params:oauth:grant-type:device_code',
    }),
  });

  const data = await response.json();
  res.status(200).json(data);
}

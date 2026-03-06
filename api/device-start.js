export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const response = await fetch('https://github.com/login/device/code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      scope: 'repo,user',
    }),
  });

  const data = await response.json();

  if (data.error) {
    return res.status(400).json({ error: data.error_description });
  }

  res.status(200).json({
    device_code:      data.device_code,
    user_code:        data.user_code,
    verification_uri: data.verification_uri,
    expires_in:       data.expires_in,
    interval:         data.interval ?? 5,
  });
}

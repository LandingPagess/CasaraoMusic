export default function handler(req, res) {
  const { provider } = req.query;
  if (provider !== 'github') {
    return res.status(400).json({ error: 'Unsupported provider' });
  }

  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID,
    scope: 'repo,user',
    state: Math.random().toString(36).substring(2),
  });

  res.redirect(302, `https://github.com/login/oauth/authorize?${params}`);
}

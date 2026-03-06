export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send(errorPage('Missing code parameter'));
  }

  let data;
  try {
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id:     process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    data = await response.json();
  } catch (err) {
    return res.status(500).send(errorPage('Token exchange failed'));
  }

  if (data.error || !data.access_token) {
    return res.status(400).send(errorPage(data.error_description || data.error || 'Unknown error'));
  }

  const message = JSON.stringify({ token: data.access_token, provider: 'github' });
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html><html><body><script>
    (function () {
      var msg = 'authorization:github:success:${message.replace(/'/g, "\\'")}';
      if (window.opener) {
        window.opener.postMessage(msg, '*');
      }
      window.close();
    })();
  </script></body></html>`);
}

function errorPage(msg) {
  const message = JSON.stringify({ error: msg });
  return `<!DOCTYPE html><html><body><script>
    (function () {
      var msg = 'authorization:github:error:${message.replace(/'/g, "\\'")}';
      if (window.opener) {
        window.opener.postMessage(msg, '*');
      }
      window.close();
    })();
  </script></body></html>`;
}

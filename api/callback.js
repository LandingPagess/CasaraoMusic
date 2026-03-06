export default async function handler(req, res) {
  const { code, error, error_description } = req.query;

  // GitHub returned an error (e.g. user denied, bad callback URL)
  if (error) {
    return res.status(200).send(postMessagePage('error', { error, error_description }));
  }

  if (!code) {
    return res.status(200).send(postMessagePage('error', { error: 'missing_code', error_description: 'No code returned by GitHub' }));
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
    return res.status(200).send(postMessagePage('error', { error: 'fetch_failed', error_description: err.message }));
  }

  if (data.error || !data.access_token) {
    return res.status(200).send(postMessagePage('error', {
      error:             data.error            || 'no_token',
      error_description: data.error_description || 'GitHub did not return an access token',
    }));
  }

  res.status(200).send(postMessagePage('success', { token: data.access_token, provider: 'github' }));
}

function postMessagePage(status, payload) {
  // Encode as base64 to avoid any quote/escape issues inside the script string
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64');
  return `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>
    (function () {
      var payload = JSON.parse(atob('${encoded}'));
      var msg = 'authorization:github:${status}:' + JSON.stringify(payload);
      if (window.opener) {
        window.opener.postMessage(msg, '*');
      }
      try { window.close(); } catch(e) {}
    })();
  \x3c/script></body></html>`;
}

export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, url }) => {
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Código de autorização ausente.', { status: 400 });
  }

  // Troca o code pelo access_token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: import.meta.env.GITHUB_CLIENT_ID,
      client_secret: import.meta.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.error || !tokenData.access_token) {
    return new Response(`Erro ao obter token: ${tokenData.error_description ?? 'desconhecido'}`, {
      status: 400,
    });
  }

  // Padrão esperado pelo Decap CMS para fechar o popup e autenticar
  const message = JSON.stringify({
    token: tokenData.access_token,
    provider: 'github',
  });

  const html = `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /></head>
  <body>
    <script>
      (function () {
        function sendToken(e) {
          window.opener.postMessage(
            'authorization:github:success:${message.replace(/'/g, "\\'")}',
            e.origin
          );
        }
        window.addEventListener('message', sendToken, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
  </body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
};

export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ request }) => {
  const origin = new URL(request.url).origin;

  const params = new URLSearchParams({
    client_id: import.meta.env.GITHUB_CLIENT_ID,
    redirect_uri: `${origin}/api/callback`,
    scope: 'repo,user',
  });

  return Response.redirect(
    `https://github.com/login/oauth/authorize?${params}`,
    302
  );
};

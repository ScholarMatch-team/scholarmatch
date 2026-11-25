export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/')) {
      const apiOrigin = env.API_ORIGIN;
      if (!apiOrigin) {
        return Response.json({ error: 'API_ORIGIN is not configured for this Worker.' }, { status: 500 });
      }

      const upstreamUrl = new URL(`${url.pathname}${url.search}`, apiOrigin);
      const headers = new Headers(request.headers);
      headers.delete('host');
      const init = {
        method: request.method,
        headers,
        redirect: 'manual'
      };
      if (request.method !== 'GET' && request.method !== 'HEAD') init.body = await request.arrayBuffer();

      return fetch(new Request(upstreamUrl, init));
    }

    return env.ASSETS.fetch(request);
  }
};

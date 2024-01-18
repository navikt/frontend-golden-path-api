const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    if (req.url.endsWith("isAlive")) {
      return new Response("OK");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Authorization header missing", { status: 403 });
    }
    // TODO: validate token x.
    return new Response("Bun og greier og sånn!");
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);

const server = Bun.serve({
    port: 3000,
    fetch(req) {
      return new Response("Bun og greier og sånn!");
    },
  });
  
  console.log(`Listening on http://localhost:${server.port} ...`);
  
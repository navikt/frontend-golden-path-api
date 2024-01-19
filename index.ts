import { verifyJwt } from "./jwt";

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    if (req.url.endsWith("isAlive")) {
      return new Response("OK");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.log("auth header missing")
      return new Response("Authorization header missing", { status: 403 });
    }
    const validationResult = verifyJwt(authHeader)
    if ('errorType' in validationResult) {
        console.log("auth header did not validate", validationResult)
        return new Response("Token is not valid", { status: 403 });
    }
    return new Response("Dette er en respons fra API-et 👋 🤖");
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);

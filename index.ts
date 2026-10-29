import { createServer } from "node:http";
import { verifyJwt } from "./jwt.ts";

const formatter = Intl.DateTimeFormat("nb-NO", {
  timeZone: "Europe/Oslo",
  dateStyle: "short",
  timeStyle: "long",
});

const server = createServer(async (req, res) => {
  if (req.url?.endsWith("isAlive")) {
    res.writeHead(200).end("OK");
    return;
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("auth header missing");
    res.writeHead(403).end("Authorization header missing");
    return;
  }
  const validationResult = await verifyJwt(authHeader);
  if ("errorType" in validationResult) {
    console.log("auth header did not validate", validationResult);
    res.writeHead(403).end("Token is not valid: ");
    return;
  }
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(`API says hi @ ${formatter.format(new Date())} 👋 🤖`);
});

server.listen(3000, () => {
  console.log("Listening on http://localhost:3000 ...");
});

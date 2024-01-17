import { validateIdportenToken } from '@navikt/next-auth-wonderwall'

const server = Bun.serve({
    port: 3000,
    async fetch(req) {
        if (req.url.endsWith("isAlive")) {
            return new Response("OK");
        }

        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            return new Response("Authorization header missing", { status: 403 });
        }
        const validationResult = await validateIdportenToken(authHeader)
        if (validationResult !== "valid") {
            return new Response("Token is not valid", { status: 403 });
        }
        return new Response("Bun og greier og sånn!");
    },
});

console.log(`Listening on http://localhost:${server.port} ...`);

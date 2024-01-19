FROM oven/bun:1 as base
WORKDIR /usr/src/app

FROM base AS install
ARG NODE_AUTH_TOKEN=$NODE_AUTH_TOKEN
RUN mkdir -p /temp/dev

RUN cat <<EOF >/temp/dev/bunfig.toml
[install.scopes]
"@navikt" = { token = "$NODE_AUTH_TOKEN", url = "https://npm.pkg.github.com" }
EOF

COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=install /temp/dev/package.json package.json

COPY index.ts .
COPY jwt.ts .

USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "index.ts" ]

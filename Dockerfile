FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:26-dev AS install
USER root
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM europe-north1-docker.pkg.dev/cgr-nav/pull-through/nav.no/node:26 AS release
WORKDIR /app
ENV NODE_ENV=production
COPY --from=install /app/node_modules node_modules
COPY package.json index.ts jwt.ts ./

EXPOSE 3000
CMD ["index.ts"]

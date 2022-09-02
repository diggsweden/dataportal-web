FROM node:16-alpine as base
WORKDIR /base
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

FROM node:16-alpine as builder
WORKDIR /build
COPY . .
COPY --from=base /base ./
RUN yarn build

FROM node:16-alpine as production
ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /build/next.config.js ./
COPY --from=builder /build/i18n.js ./
COPY --from=builder /build/public ./public
COPY --from=builder /build/.next ./.next
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./package.json
COPY --from=builder /build/locales ./locales

COPY --from=builder /build/pages ./pages
COPY --from=builder /build/.env.production ./.env.production
COPY --from=builder /build/entrypoint.sh /usr/local/bin/entrypoint.sh

ENV NEXT_TELEMETRY_DISABLED 1

RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

#OpenShift specific
RUN chgrp -R 0 /app && \
chmod -R g=u /app
USER 1001

CMD ["yarn","start"]
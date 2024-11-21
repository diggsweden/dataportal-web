FROM node:22-alpine as base
WORKDIR /base
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases
COPY .yarn/plugins ./.yarn/plugins
RUN yarn install

FROM node:22-alpine as builder
WORKDIR /build
ARG delete_file
COPY . .
COPY --from=base /base ./
RUN if [[ -z "$delete_file" ]] ; then echo "No files removed" ; else rm ./$delete_file ; fi
RUN yarn build

FROM node:22-alpine as production
ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /build/next.config.js ./
COPY --from=builder /build/i18n.js ./
COPY --from=builder /build/public ./public
COPY --from=builder /build/.next ./.next
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/.yarn ./yarn
COPY --from=builder /build/package.json ./package.json
COPY --from=builder /build/locales ./locales

COPY --from=builder /build/pages ./pages
COPY --from=builder /build/.env.production ./.env.production
COPY --from=builder /build/entrypoint.sh /usr/local/bin/entrypoint.sh

ENV NEXT_TELEMETRY_DISABLED 1
ENV SKIP_YARN_COREPACK_CHECK 0

RUN chmod +x /usr/local/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

#OpenShift specific
RUN chgrp -R 0 /app && \
    chmod -R g=u /app
USER 1001

CMD ["yarn","start"]

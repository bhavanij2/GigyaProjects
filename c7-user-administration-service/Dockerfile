# Dependency build
FROM node:12-slim AS dependency
ARG NPM_E_AUTH_TOKEN

RUN npm cache clean --force
RUN rm -rf ~/.npm

RUN npm config set registry https://registry.npmjs.org
RUN npm config set @monsantoit:registry https://npm.platforms.engineering
RUN npm config set //npm.platforms.engineering/:_authToken $NPM_E_AUTH_TOKEN
RUN npm config set strict-ssl=false

WORKDIR /opt/app
COPY package*.json ./
RUN npm install

#build
FROM node:12-slim as build
WORKDIR /opt/app
COPY --from=dependency /opt/app/node_modules node_modules
COPY . .
RUN npm run build
RUN npm prune --production
RUN rm -f .npmrc

#deployable
#copy only what you need
FROM node:12-slim
WORKDIR /usr/src/app

COPY --from=build /opt/app/dist /usr/src/app/dist
COPY --from=build /opt/app/node_modules /usr/src/app/node_modules

ENV PORT=80
ENV NODE_ENV=production
ENV DD_SERVICE_NAME=c7-user-administration-service
ENV DD_ENV=non-prod
ENV DD_RUNTIME_METRICS_ENABLED=true

CMD node dist/server.js
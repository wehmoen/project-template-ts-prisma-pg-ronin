FROM node:21-slim as build

WORKDIR /build

COPY package.json .
COPY pnpm-lock.yaml .

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm build

FROM node:21-slim

RUN npm install -g pnpm

WORKDIR /app

COPY --from=build /build/dist /app/dist
COPY --from=build /build/package.json /app/package.json
COPY --from=build /build/pnpm-lock.yaml /app/pnpm-lock.yaml

CMD ["pnpm", "container"]
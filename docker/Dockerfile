FROM node:16 AS ui_builder
WORKDIR /ui
COPY /ui /ui
RUN yarn
RUN yarn build

FROM node:16 AS app_builder
WORKDIR /app
COPY /app /app
RUN yarn
COPY --from=ui_builder /ui/dist /app/public/my-open-vdp/
RUN yarn build

FROM node:16
WORKDIR /app
COPY --from=app_builder /app/build /app/build
COPY --from=app_builder /app/dist /app/dist
COPY --from=app_builder /app/package.json /app/package.json
COPY --from=app_builder /app/yarn.lock /app/yarn.lock
RUN yarn install --prod
ENTRYPOINT [ "node" ]
CMD [ "build/server.mjs" ]

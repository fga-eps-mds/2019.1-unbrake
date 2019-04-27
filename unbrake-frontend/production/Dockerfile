FROM node:11-alpine as builder

WORKDIR /app/frontend

COPY . .

RUN set -x \
  && npm install --no-optional --production \
  && npm run build

# Frontend has his server on Dockerfile because
# the node service will only compile, won't start
# any service unlike the API which has a service
# on Django container which interact with NGINX
FROM nginx:1.15.12-alpine

LABEL description="Frontend for UnBrake application" 

COPY --from=builder /app/frontend/build /data/www

EXPOSE 80

ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]

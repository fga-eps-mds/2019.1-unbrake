FROM node:11-alpine

LABEL description="To be used in react development, just to keep environments unified between users and reduce complexity."

WORKDIR /app/frontend

COPY unbrake-frontend/package.json .

# git and bash needed for running linters
RUN set -x \
  && apk update \
  && apk add --no-cache bash git \
  && mkdir -p .git/hooks \
  && npm install --no-optional \
  && rm -rf /var/cache/apk/*

EXPOSE 3000

COPY unbrake-frontend/.eslintrc.json unbrake-frontend/.prettierrc ./
COPY unbrake-frontend/public public
COPY unbrake-frontend/scripts scripts
COPY unbrake-frontend/src src

ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["start"]

FROM node:11-alpine

LABEL description="To be used in react development, just to keep environments unified between users and reduce complexity."

WORKDIR /app/frontend

COPY package*.json .

# git and bash needed for running linters
RUN set -x \
  && apk add --no-cache bash git \
  && mkdir -p .git/hooks \
  && npm install --no-optional

EXPOSE 3000

COPY .eslintrc.json .eslintignore .prettierrc scripts/entrypoint.dev ./
COPY public public
COPY scripts scripts
COPY src src
COPY hooks hooks

ENTRYPOINT ["/app/frontend/entrypoint.dev"]
CMD ["start"]

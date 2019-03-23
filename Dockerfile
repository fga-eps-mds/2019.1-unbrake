FROM node:alpine

LABEL description="To be used in react development, just to keep environments unified between users and reduce complexity."

COPY . /app
WORKDIR /app/unbrake

RUN npm install --no-optional

ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["start"]

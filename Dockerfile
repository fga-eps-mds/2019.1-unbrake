FROM node:alpine

LABEL description="To be used in react development. Just to keep environments unified and reduce complexity"

COPY . /app
WORKDIR /app/unbrake

RUN npm install

ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["start"]

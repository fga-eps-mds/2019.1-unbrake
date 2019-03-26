FROM node:11-alpine

LABEL description="To be used in react development, just to keep environments unified between users and reduce complexity."

WORKDIR /app/frontend

COPY unbrake-frontend .

RUN npm install --no-optional

ENTRYPOINT ["/usr/local/bin/npm"]
CMD ["start"]

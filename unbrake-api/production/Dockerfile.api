FROM python:3.7-alpine as builder

ENV PYTHONUNBUFFERED 1

COPY production/requirements.txt /app/api/

# https://github.com/frol/docker-alpine-python3/issues/1
RUN set +x \
    && apk update \
    && apk add --no-cache gcc python3-dev musl-dev postgresql-dev \
    && pip install -r /app/api/requirements.txt


FROM python:3.7-alpine

LABEL description="API in Django with GraphQL for UnBrake application"

ENV PYTHONUNBUFFERED 1
ENV DJANGO_SETTINGS_MODULE "production.settings"

WORKDIR /app/api

COPY --from=builder /usr/local/lib/python3.7/site-packages/ /usr/local/lib/python3.7/site-packages/
COPY --from=builder /usr/local/bin/gunicorn* /usr/local/bin/
COPY . .

RUN apk add --no-cache libpq \
	&& rm -rf secrets

EXPOSE 8000

CMD ["/app/api/production/entrypoint"]

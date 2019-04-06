FROM python:3.7-alpine

LABEL description="To be used in django development, just to keep environments unified between users and reduce complexity."

ENV PYTHONUNBUFFERED TRUE

WORKDIR /app/api

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN set +x \
  && rm -rf secrets

EXPOSE 8000

ENTRYPOINT ["/app/api/scripts/entrypoint.dev"]
CMD ["runserver", "0.0.0.0:8000"]

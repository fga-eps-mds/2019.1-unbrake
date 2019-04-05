FROM python:3.7-alpine

ENV PYTHONUNBUFFERED TRUE

WORKDIR /app/api

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

RUN set +x \
  && ./manage.py makemigrations && ./manage.py migrate \
  && ls \
  && rm -rf secrets

EXPOSE 8000

ENTRYPOINT ["/app/api/manage.py"]
CMD ["runserver", "0.0.0.0:8000"]

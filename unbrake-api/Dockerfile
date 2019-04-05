FROM python:3.7-alpine

ENV PYTHONUNBUFFERED TRUE

WORKDIR /app/api

COPY requirements.txt .

RUN pip install -r requirements.txt

EXPOSE 8000

COPY . .

ENTRYPOINT ["/app/api/manage.py"]
CMD ["runserver", "0.0.0.0:8000"]

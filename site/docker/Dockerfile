FROM python:3.6-alpine

WORKDIR /home

COPY docker/requirements.txt . 

RUN apk add make

RUN pip3 install -r requirements.txt

# Couldn't use alpine, I've had trouble because of appindicator lib
# Tried to compile manually but needed others missing libraries
FROM golang:1.12.5

LABEL description="Environment with needed libraries for unbrake local application"

RUN apt-get update && apt-get install -y --no-install-recommends \
        libgtk-3-dev \
        libappindicator3-dev \
    && rm -rf /var/lib/apt/lists/* \
    && go get -v \
        github.com/tarm/serial \
        github.com/getlantern/systray \
        \
        golang.org/x/lint/golint

WORKDIR /go/src/github.com/fga-eps-mds/2019.1-unbrake/unbrake-local

ENTRYPOINT ["/usr/local/go/bin/go"]

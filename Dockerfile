FROM debian:bullseye-slim

RUN apt-get update \
    && DEBIAN_FRONTEND="noninteractive" apt-get install -y ffmpeg tzdata fontconfig fonts-dejavu xsltproc jq xmltv-util curl bsdextrautils man \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . ./

ENTRYPOINT [ "/app/generator.sh" ]

FROM debian:bullseye-slim

RUN apt-get update \
    && DEBIAN_FRONTEND="noninteractive" apt-get install -y ffmpeg tzdata fontconfig fonts-dejavu xsltproc jq xmltv-util curl bsdextrautils man bc \
    && rm -rf /var/lib/apt/lists/*

ENV ETV_FILLER_DOCKER 1

WORKDIR /app

COPY . ./

ENTRYPOINT [ "/app/generator.sh" ]

FROM debian:stable-slim

RUN apt-get update \
    && DEBIAN_FRONTEND="noninteractive" apt-get install -y tzdata fontconfig fonts-dejavu \
    && rm -rf /var/lib/apt/lists/*

ENV ETV_FILLER_DOCKER 1

WORKDIR /app

COPY ersatztv-filler-linux /app

# Make the binary executable (if needed)
RUN chmod +x /app/ersatztv-filler-linux

# Expose any necessary ports
EXPOSE 8408

# Specify the command to run when the container starts
CMD ["./ersatztv-filler-linux"]

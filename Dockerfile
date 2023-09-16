FROM debian:bullseye-slim

RUN apt-get update

ENV ETV_FILLER_DOCKER 1

WORKDIR /app

COPY ersatztv-filler /app

# Make the binary executable (if needed)
RUN chmod +x /app/ersatztv-filler

# Expose any necessary ports
EXPOSE 8408

# Specify the command to run when the container starts
CMD ["./ersatztv-filler"]

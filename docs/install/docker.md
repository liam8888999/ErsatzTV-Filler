# ErsatzTV-Filler Installation (Docker)

Docker Install

1. Download the latest container image

    ```
    docker pull liam2003/ersatztv-filler
    ```

2. Create Directories to store container data

    1. Create a directory to store configuration data

        ```
        mkdir /path/to/config
        ```

    2. Create a directory to store custom audio files (if not using an existing audio location)

        ```
        mkdir /path/to/audio
        ```

    3. Create a directory to store logs

        ```
        mkdir /path/to/logs
        ```

    4. Create a directory to store output files

        ```
        mkdir /path/to/output
        ```

3. Create and run a container

    ```
    docker run -d \
      --name ersatztv-filler \
      -e TZ=America/Chicago \
      -p 8408:8408 \
      -v /path/to/config:/app \
      -v /path/to/audio:/path/to/audio:ro \
      -v /path/to/logs:/app/logs \
      -v /path/to/output:/path/to/output \
      --restart unless-stopped \
      liam2003/ersatztv-filler
    ```

# ErsatzTV-Filler Development

## NODEJS ERSATZTV-FILLER DEV INSTRUCTIONS
#### Install nodejs
1. `sudo apt install nodejs`
#### Install npm
2. `sudo apt install npm`
#### Clone Repository
3. `git clone https://github.com/liam8888999/ErsatzTV-Filler.git`
#### Install dependencies
4. `npm ci`
#### Run the node dev server
5. `npm run dev`



## Docker

### Build

```shell
docker build -t liam8888999/ersatztv-filler .
```

### Run

```shell
docker run --rm -it -v $(pwd):/config -v /media/audio/whatever:/audio -v /media/whatever:/output -v /media/audio/whatever:/tmp/ErsatzTV-Filler liam8888999/ersatztv-filler /config/config.conf
```

## Development
Do not manually update the changelog
#### To update the changelog and release number run the command
1. npm run release
#### And follow the prompts


## Documentation

### Clone Repository
`git clone -b gh-pages https://github.com/liam8888999/ErsatzTV-Filler.git`

### Build docs
```python
python3 -m mkdocs build
```

### Serve Docs
The docs can be generated on the fly and served on a local web server for Development
```python
python3 -m mkdocs serve
```

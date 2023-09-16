# ErsatzTV-Filler Development

This is the different options to set up the development environment for ErsatzTV-Filler

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

#### Build
```shell
docker build -t liam8888999/ersatztv-filler .
```
#### Push to Repository
```shell
docker push
```

## Development

Do not manually update the changelog

#### To update the changelog and release number run the command
1. npm run release
#### And follow the prompts


## Documentation

#### Clone Repository
`git clone -b gh-pages-config https://github.com/liam8888999/ErsatzTV-Filler.git`

### Publish docs

#### Setup python virtual env
```bash
source myenv/bin/activate
```
#### Build the site
```python
mkdocs build
```
#### Publish the site
```python
ghp-import -n -p -f site
```

### Serve Docs
The docs can be generated on the fly and served on a local web server for Development
```python
python3 -m mkdocs serve
```

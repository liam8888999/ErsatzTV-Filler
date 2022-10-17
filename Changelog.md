# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [0.0.8 - Beata] - 2022-10-17

# Changed

- filler types moved to helper scripts with the user able to set which filler types to create by setting a variable in the config.conf file

# Removed

- previous bug fix with decimals in etv channel numbers as etv only supports titles with 1 decimal not 2


## [0.0.7 - Beata] - 2022-10-17

# Fixed

- fix bug with decimals in etv channel numbers

## [0.0.6 - Beata] - 2022-10-17
jq must be installed as a requirement in this version

# Fixed

- ffmpeg now automatically overwrites existing video
- fix temperature unit

## [0.0.5 - Beata] - 2022-10-17
jq must be installed as a requirement in this version

# Fixed

- Random audio wasnt random
- naming format for news videos (possible breaking change for some people)

## added

- version number at the top of generator.sh and sample-config.conf

## [0.0.4 - Beta] - 2022-10-16

## Added

- Add channel offline filler

## [0.0.3 - Beta] - 2022-10-16

## Added

- support for news articles (users will need to 'sudo apt install xsltproc')
- fallback variables if they are not filled in in the config.conf file

## [0.0.2 - Beta] - 2022-10-15
### Refactored

- README.md to include new use of config file/updating and installing

### Added

- support for random background colours
- support for the usage of a configuration file
- added gitignore file for generated videos/files

### Fixed



## [0.0.1 - Beta] - 2022-10-15

### Added

- support for setting background colour, resolution and length
- background music

### Fixed

- Bug with spaces in names. the user can now place the name with spaces in the section provided and the script will automatically deal with the spaces as required.
- Remove blurry background video

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [0.0.15 - Beata] - 2022-10-19

# Fixed

- typo that was selecting random colours for channel offline Filler
- Esacpe some illegal characters in news filler

## [0.0.14 - Beata] - 2022-10-18

# Fixed

- Typo which was preventing version number in sample-config.conf from being updated
- Update first line of readme.md to include newer features
- Fix video length
- fix weather where places have a space in their name
- fix some funny xml strings that i have come across
- output variable in config.conf now does nothing when using docker

## [0.0.13 - Beata] - 2022-10-18

# Fixed

- Video timestamps are now updated

## [0.0.12 - Beata] - 2022-10-18

# Fixed

- dependencies will now automatically detect if they are already installed and if they are not it will try to install them using apt

- Fix major breaking bug in v0.0.11 where workdir wasnt being generated and was causing the script to fail at every step


## [0.0.11 - Beata] - 2022-10-18

# Added

- dependencies will now automatically install if running on an operation system that uses apt package manager

# Fixed

- script will now end in ErsatzTV-Filler directory

## [0.0.10 - Beata] - 2022-10-17

# Added

- Added more audio files

## [0.0.9 - Beata] - 2022-10-17

# Changed

- Move cleanup of temp files to end of script instead of start of next run

# added

- automatic update support (default = yes)

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

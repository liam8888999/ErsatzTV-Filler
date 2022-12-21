# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [0.0.25 - Beta] - 2022-12-21

# Fixed
- This version includes small bug fixes

## [0.0.24 - Beta] - 2022-12-20

# Added
- themeability
Themes can be added by copying the default.theme file in the themes subfolder or /themes for docker to xxx.theme and editing the variables then changing the theme in config.conf

## [0.0.23 - Beta] - 2022-12-18

# Fixed
- Bug fixes

## [0.0.22 - Beta] - 2022-12-16

# Added
- Speed improvements

## [0.0.21 - Beta] - 2022-11-20

# Added
- Weather V4 which is a combination of all other weather versions in 1 file
- Weather V4 can be shuffled

## [0.0.20 - Beta] - 2022-11-13

# Fixed
- No longer generates filler with old variables after auto update. the script will need to be run again
- Add option to use smaller log files per run

## [0.0.19 - Beta] - 2022-11-07

# Fixed
- A few under the hood issues with random audio again
- Better logging sections

## [0.0.18 - Beta] - 2022-11-07

# Added

- Audio fade in/out
- video fade in/out
- Added logging

# Fixed

- Added improvements for auto update (now runs at the beginning)
- Issues with randomising audio

# Note
- There is now a dependency on the bc package
- The docker command has slightly changed to include the log location


## [0.0.17 - Beta] - 2022-10-20

# Added

- support custom audio location
- Support audio files with a space in name

## [0.0.16 - Beta] - 2022-10-20

# Added

- Prevent more than 1 instance of script running at the same time
- Auto update config.conf with new variables when available
- Allow custom audio files (flac or mp3s can be dropped in the custom-audio folder)

## [0.0.15 - Beta] - 2022-10-19

# Fixed

- typo that was selecting random colours for channel offline Filler
- Fix % character in news feed

## [0.0.14 - Beta] - 2022-10-18

# Fixed

- Typo which was preventing version number in sample-config.conf from being updated
- Update first line of readme.md to include newer features
- Fix video length
- fix weather where places have a space in their name
- fix some funny xml strings that i have come across
- output variable in config.conf now does nothing when using docker

## [0.0.13 - Beta] - 2022-10-18

# Fixed

- Video timestamps are now updated

## [0.0.12 - Beta] - 2022-10-18

# Fixed

- dependencies will now automatically detect if they are already installed and if they are not it will try to install them using apt

- Fix major breaking bug in v0.0.11 where workdir wasnt being generated and was causing the script to fail at every step


## [0.0.11 - Beta] - 2022-10-18

# Added

- dependencies will now automatically install if running on an operation system that uses apt package manager

# Fixed

- script will now end in ErsatzTV-Filler directory

## [0.0.10 - Beta] - 2022-10-17

# Added

- Added more audio files

## [0.0.9 - Beta] - 2022-10-17

# Changed

- Move cleanup of temp files to end of script instead of start of next run

# added

- automatic update support (default = yes)

## [0.0.8 - Beta] - 2022-10-17

# Changed

- filler types moved to helper scripts with the user able to set which filler types to create by setting a variable in the config.conf file

# Removed

- previous bug fix with decimals in etv channel numbers as etv only supports titles with 1 decimal not 2


## [0.0.7 - Beta] - 2022-10-17

# Fixed

- fix bug with decimals in etv channel numbers

## [0.0.6 - Beta] - 2022-10-17
jq must be installed as a requirement in this version

# Fixed

- ffmpeg now automatically overwrites existing video
- fix temperature unit

## [0.0.5 - Beta] - 2022-10-17
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

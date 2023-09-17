# Changelog

## [1.0.4](https://github.com/liam8888999/ErsatzTV-Filler/compare/1.0.3.1...1.0.4) (2023-09-17)

## [1.0.3](https://github.com/liam8888999/ErsatzTV-Filler/compare/V1.0.2...1.0.3) (2023-09-17)


### Changed

* add line under version number in changelog ([616cc90](https://github.com/liam8888999/ErsatzTV-Filler/commit/616cc90e02c6ce5dc7cea90f5521c6f48070e286))


### Fixed

* define logger ([3cb747e](https://github.com/liam8888999/ErsatzTV-Filler/commit/3cb747ea24789887cb94e2e4b61460d1e1f2da25))
* error logging use logger ([36ad35b](https://github.com/liam8888999/ErsatzTV-Filler/commit/36ad35bbe0f6b33c3431ef6cf01c4a00fbc161cf))

## [1.0.2](https://github.com/liam8888999/ErsatzTV-Filler/compare/V1.0.1...1.0.2) (2023-09-16)


### Removed

* ffmpeg path logging ([8837433](https://github.com/liam8888999/ErsatzTV-Filler/commit/88374331ee23f99fecc5f91933d6123bde397b00))


### Fixed

* prevent xmltv merger always claiming that there are no xmltv files ([004fe33](https://github.com/liam8888999/ErsatzTV-Filler/commit/004fe336b1c603375cd1b621183dc8319bfc0be1))
* some logging fixes ([a0d7482](https://github.com/liam8888999/ErsatzTV-Filler/commit/a0d7482722ad3d1e2c4e9dff7574d8011a102a26))
* use logger instead of console logs ([d8e7c5c](https://github.com/liam8888999/ErsatzTV-Filler/commit/d8e7c5cdc0be55926093f36f90a4e3ca91454293))

## [1.0.1](https://github.com/liam8888999/ErsatzTV-Filler/compare/V1.0.0...1.0.1) (2023-09-16)


### Fixed

* add support for https with channel-offline filler and small path fix ([d1627ce](https://github.com/liam8888999/ErsatzTV-Filler/commit/d1627cef6418ae1cd16a73ce20f299f7ee3aed29))
* error with ersatztv location showing on every config page ([10da886](https://github.com/liam8888999/ErsatzTV-Filler/commit/10da886b03738e1cb4779463d2212709c42314e9))
* ffmpeg path not working correctly ([5595f9f](https://github.com/liam8888999/ErsatzTV-Filler/commit/5595f9f91861da6ac9978b920f9e897af8666cc3))
* typo ([3b8f692](https://github.com/liam8888999/ErsatzTV-Filler/commit/3b8f692c3aa9fcd31295353fb8ffeff9919723ff))

## [1.0.0 - Beta](https://github.com/liam8888999/ErsatzTV-Filler/compare/0.0.26...1.0.0) (2023-09-16)

Intial Version for nodejs version. more information can be found at https://liam8888999.github.io/ErsatzTV-Filler/

## [0.0.26 - Beta] - 2023-09-10

### Removed
- Autoupdate features

All auto update features have been removed as they are incompatible with future updates and there will be breaking changes in the next release that will totally break compatibility. This version will otherwise keep working and will move to a new bash-version branch of the github shortly if you want to stick with what is currently available but there will be no new feature updates on that branch and it will become obsolete. Docker images will not be built on the branch either and the old images will be updated to the newer version so if you want to run in docker you will need to manually build the container against that branch or prevent the current container updating (NOT RECOMMENDED).

Information about the new version and updating will be posted in the coming weeks on the discord server at https://discord.gg/x4Nk4sfgSg

## [0.0.25 - Beta] - 2022-12-21

### Fixed
- This version includes small bug fixes

## [0.0.24] - Beta - 2022-12-20

### Added
- themeability
Themes can be added by copying the default.theme file in the themes subfolder or /themes for docker to xxx.theme and editing the variables then changing the theme in config.conf

## [0.0.23] - Beta - 2022-12-18

### Fixed
- Bug fixes

## [0.0.22] - Beta - 2022-12-16

### Added
- Speed improvements

## [0.0.21] - Beta - 2022-11-20

### Added
- Weather V4 which is a combination of all other weather versions in 1 file
- Weather V4 can be shuffled

## [0.0.20] - Beta - 2022-11-13

### Fixed
- No longer generates filler with old variables after auto update. the script will need to be run again
- Add option to use smaller log files per run

## [0.0.19] - Beta - 2022-11-07

### Fixed
- A few under the hood issues with random audio again
- Better logging sections

## [0.0.18] - Beta - 2022-11-07

### Added

- Audio fade in/out
- video fade in/out
- Added logging

### Fixed

- Added improvements for auto update (now runs at the beginning)
- Issues with randomising audio

### Note
- There is now a dependency on the bc package
- The docker command has slightly changed to include the log location


## [0.0.17] - Beta - 2022-10-20

### Added

- support custom audio location
- Support audio files with a space in name

## [0.0.16] - Beta - 2022-10-20

### Added

- Prevent more than 1 instance of script running at the same time
- Auto update config.conf with new variables when available
- Allow custom audio files (flac or mp3s can be dropped in the custom-audio folder)

## [0.0.15] - Beta - 2022-10-19

### Fixed

- typo that was selecting random colours for channel offline Filler
- Fix % character in news feed

## [0.0.14] - Beta - 2022-10-18

### Fixed

- Typo which was preventing version number in sample-config.conf from being updated
- Update first line of readme.md to include newer features
- Fix video length
- fix weather where places have a space in their name
- fix some funny xml strings that i have come across
- output variable in config.conf now does nothing when using docker

## [0.0.13] - Beta - 2022-10-18

### Fixed

- Video timestamps are now updated

## [0.0.12] - Beta - 2022-10-18

### Fixed

- dependencies will now automatically detect if they are already installed and if they are not it will try to install them using apt

- Fix major breaking bug in v0.0.11 where workdir wasnt being generated and was causing the script to fail at every step


## [0.0.11] - Beta - 2022-10-18

### Added

- dependencies will now automatically install if running on an operation system that uses apt package manager

### Fixed

- script will now end in ErsatzTV-Filler directory

## [0.0.10] - Beta - 2022-10-17

### Added

- Added more audio files

## [0.0.9] - Beta - 2022-10-17

### Changed

- Move cleanup of temp files to end of script instead of start of next run

### Added

- automatic update support (default = yes)

## [0.0.8] - Beta - 2022-10-17

### Changed

- filler types moved to helper scripts with the user able to set which filler types to create by setting a variable in the config.conf file

### Removed

- previous bug fix with decimals in etv channel numbers as etv only supports titles with 1 decimal not 2


## [0.0.7] - Beta - 2022-10-17

### Fixed

- fix bug with decimals in etv channel numbers

## [0.0.6] - Beta - 2022-10-17
jq must be installed as a requirement in this version

### Fixed

- ffmpeg now automatically overwrites existing video
- fix temperature unit

## [0.0.5] - Beta - 2022-10-17
jq must be installed as a requirement in this version

### Fixed

- Random audio wasnt random
- naming format for news videos (possible breaking change for some people)

## [0.0.4] - Beta - 2022-10-16

### Added

- Add channel offline filler

## [0.0.3] - Beta - 2022-10-16

### Added

- support for news articles (users will need to 'sudo apt install xsltproc')
- fallback variables if they are not filled in in the config.conf file

## [0.0.2] - Beta - 2022-10-15
### Refactored

- README.md to include new use of config file/updating and installing

### Added

- support for random background colours
- support for the usage of a configuration file
- added gitignore file for generated videos/files

## [0.0.1] - Beta - 2022-10-15

### Added

- support for setting background colour, resolution and length
- background music

### Fixed

- Bug with spaces in names. the user can now place the name with spaces in the section provided and the script will automatically deal with the spaces as required.
- Remove blurry background video
# ErsatzTV-Filler - Themes

## What are themes?

Themes are files that include information such as colours that are used in the diffent filler videos to customise the look.

## How do I get a new theme?

The ErsatzTV-Filler webpage has a theme page where you can choose a theme and click 'install this theme', this will download the theme file for use in your videos.

## How do I select a theme to use?

The ErsatzTV-Filler webpage has a theme page where you can choose a theme and click 'use this theme', the theme will then be used for all future filler video generations unless changed.

## What is the difference between a User theme and a System theme?

A User theme is a theme file that the user has manually created for themselves. A system theme is a theme that has been downloaded via the webpage.

## How can I create a new User theme?

### Automated (Recommended)

Themes can be created in the Theme creator found on the themes page. There is a preview window which will show what your theme looks like as you are creating it.

### Manually (Not Recommended)

New user themes can be created in your favourite text editor as it is only a simple json file to create and edit.

You will need to create a file with the name '{themename}.theme', where {themename} is the name of your theme. You will then need to copy in the correct json and edit the variables. This file will need to go in the Themes/User folder.

*Note:* Ensure your theme name and filename are 1 word

### Json file template

```json
{
  "ErsatzTVFillerTheme": {
    "ThemeName": "SystemLight",
    "Creator": "liam8888999"
  },
  "Offline": {
  "offlinetextcolour": "404040",
  "offlinetitlecolour": "000000",
  "offlinebackgroundcolour": "ffffff"
  },
  "News": {
  "newstextcolour": "404040",
  "newstitlecolour": "000000",
  "newsbackgroundcolour": "ffffff"
  },
  "Weather": {
  "weatherbackgroundcolour": "000000"
  }
}
```

*Note:* Themes use hex colours without the leading #

## Can I share my theme?

### Automated (Recommended)

There is a setting in the theme creator that will automatically submit your theme for upload if the checkbox is checked.

### Manually (Not Recommended)

Yes. Themes can be shared by creating a pull request at the [ErsatzTV-Filler Themes Github](https://github.com/liam8888999/ErsatzTV-Filler-Themes) or asking in the [Discord](https://discord.gg/x4Nk4sfgSg) if you dont know how to do that or dont want to.

Your theme will then be included in the next version of ErsatzTV-Filler for everyone to download and use under System themes.

Be sure to give your self credit in the Json creator section.

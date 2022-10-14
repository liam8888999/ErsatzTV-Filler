# ErsatzTV-Filler
 Currently this script only generates weather forecast filler for ErsatzTV or similar programs.

 Check back regularly for updates.

Discord chat: https://discord.gg/x4Nk4sfgSg

 To update just follow this again. for now you will need to manually reset the variables however, if anyone has suggestions for updating in a better way or a way to save the variables during updating open an issue to leave your ideas there.

 To use you will need to be on linux

 git clone https://github.com/liam8888999/ErsatzTV-Filler.git

 to download the files then you will need to

 chmod +X generator.sh

 after this is done you will need to open generator.sh with your favourite text editor and edit the following lines

 output=x
 city=x
 state=x

 replace x with your desired location for state and city and output is the path you point ErsatzTV to for filler so the generator.sh will automatically create the files in that location.

 you may also want to add it as a cron job to run at your desired interval, to do this you type

 sudo crontab -e

 when that opens go to the last line and press enter to make a new line, then type something like

 0 * * * * /home/xxx/ErsatzTV-Filler/generator.sh

 this will make it run once every hour

For more information on how to use this with ErsatzTV please visit https://ersatztv.org/user-guide/filler/





 I am interested in making different kinds of filler so if you have any suggestions, bugs, improvements, etc. just open a issue and i will get back as soon as i can

#!/bin/bash
#V0.0.9 - Beta

# load in configuration variables
. config-temp.conf
#test variable run yes/no
#convert variable to lowercase
autoupdate1=$(echo $autoupdate | tr '[:upper:]' '[:lower:]')

echo "#!/bin/bash" >> /tmp/ErsatzTV-Filler-autoupdate.sh
if [[ $autoupdate = yes ]]
then
echo "git pull" >> /tmp/ErsatzTV-Filler-autoupdate.sh
echo "exit 0" >> /tmp/ErsatzTV-Filler-autoupdate.sh
else
echo "exit 0" >> /tmp/ErsatzTV-Filler-autoupdate.sh
fi

echo "rm $0" >> /tmp/ErsatzTV-Filler-autoupdate.sh

chmod +x /tmp/ErsatzTV-Filler-autoupdate.sh

# cleanup

rm -f $helperdir/config-temp.conf

exec /tmp/ErsatzTV-Filler-autoupdate.sh

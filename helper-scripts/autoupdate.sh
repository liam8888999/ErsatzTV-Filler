#!/bin/bash
#V0.0.9 - Beta

# load in configuration variables
. config-temp.conf
#for test
#test variable run yes/no
#convert variable to lowercase
autoupdate1=$(echo $autoupdate | tr '[:upper:]' '[:lower:]')
if [[ $autoupdate1 = yes ]]
then
echo '#!/bin/bash' >> /tmp/ErsatzTV-Filler-autoupdate.sh
echo cd $scriptdir
echo git pull >> /tmp/ErsatzTV-Filler-autoupdate.sh
echo rm \$0 >> /tmp/ErsatzTV-Filler-autoupdate.sh

chmod +x /tmp/ErsatzTV-Filler-autoupdate.sh

# cleanup

rm -f $helperdir/config-temp.conf

exec /tmp/ErsatzTV-Filler-autoupdate.sh
else
rm -f $helperdir/config-temp.conf
exit 0
fi

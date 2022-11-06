#!/bin/bash
#V0.0.17 - Beta

# load in configuration variables
. config-temp.conf

#General cleanup

rm -f $weatherdir/*
rm -r $workdir/*
rm -f $scriptdir/running.txt

exit 0

#!/bin/bash
#V0.0.11 - Beta

# load in configuration variables
. config-temp.conf

#General cleanup

rm -f $weatherdir/*
rm -r $workdir/*

./autoupdate.sh
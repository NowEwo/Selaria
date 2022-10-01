#!/bin/bash

echo "-----------------------------------"
echo "Create local SSL files"


##########################################
# Go to directory
##########################################

if [ "$1" != "" ]; then
	cd "$1" > /dev/null 2>&1
	if [ $? != 0 ]; then
	    echo "Fail to change dir to \"$1\". Aborting."
	    exit 1;
	fi
fi

if [ "$2" = "" ]; then
	name="test"
else
	name=$2
fi


##########################################
# Clean 
##########################################

rm ssl_hostname.txt $name.csr $name.key $name.pass.key $name.crt > /dev/null 2>&1


##########################################
# Verify command availability  
##########################################

command -v hostname >/dev/null 2>&1 || { echo >&2 "Command "hostname" not found.  Aborting."; exit 1; }
command -v openssl >/dev/null 2>&1 || { echo >&2 "Command "openssl" not found.  Aborting."; exit 1; }


##########################################
# Save hostname in a file
##########################################

echo $'\n\n\n\n' > ssl_hostname.txt
hostname >> ssl_hostname.txt
echo $'\n\n\n' >> ssl_hostname.txt


##########################################
# Generate key
##########################################

openssl genrsa -des3 -passout pass:x -out $name.pass.key 2048 >/dev/null 2>&1
openssl rsa -passin pass:x -in $name.pass.key -out $name.key >/dev/null 2>&1

##########################################
# Generate key
##########################################

cat ssl_hostname.txt | openssl req -new -key $name.key -out $name.csr >/dev/null 2>&1


##########################################
# Generate certificate
##########################################

openssl x509 -req -days 365 -in $name.csr -signkey $name.key -out $name.crt 
#>/dev/null 2>&1


##########################################
# Remove temp files
##########################################

rm $name.pass.key $name.csr ssl_hostname.txt > /dev/null 2>&1


##########################################
# Detects error
##########################################

if [ ! -e "$name.key" ] || [ ! -e "$name.crt" ]; then
    echo "Fail to generate the files. Aborting."
fi


##########################################
# Exit
##########################################

if [ -e "$name.key" ] && [ -e "$name.crt" ]; then
	echo "Successfully created"
	dir=${PWD##*/}  
	echo "-----------------------------------"
	echo "SSL files:"	
	echo "- $dir/$name.key"
	echo "- $dir/$name.crt"
    exit 0;
fi

exit 1;
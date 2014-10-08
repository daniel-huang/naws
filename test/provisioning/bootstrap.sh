#!/bin/bash

PX="[NAWS    ] "

#------------------------------------------------------------------------------
# Make sure we have the right PPA for git installed for shallow cloning
#------------------------------------------------------------------------------
which add-apt-repository || {
  echo "${PX}Installing add-apt-repository..."
  apt-get update
  apt-get install software-properties-common python-software-properties -y
}

# Add git-core/ppa if it doesn't exist
grep -h "^deb.*git-core/ppa" /etc/apt/sources.list.d/* > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "${PX}Adding git-core/ppa to apt-get sources to get the latest version of git..."
  add-apt-repository ppa:git-core/ppa  
  apt-get update
fi

apt-get install curl git vim python-dev python-pip build-essential -y

#------------------------------------------------------------------------------
# Alrighty, let's install zeromq
#------------------------------------------------------------------------------
if [ ! -d /tmp/zeromq-4.0.4 ]; then
  echo "${PX}Downloading zeromq 4.0.4..."
  cd /tmp
  wget http://download.zeromq.org/zeromq-4.0.4.tar.gz 
  tar -xvf zeromq-4.0.4.tar.gz
  echo "${PX}Successfully downloaded zeromq 4.0.4 and unpacked to /tmp/zeromq-4.0.4"

  echo "${PX}Installing zeromq 4.0.4"
  cd /tmp/zeromq-4.0.4
  ./configure
  make 
  make install
  ldconfig
  echo "${PX}Successfully installed zeromq 4.0.4"
fi

`dpkg -l | grep python-zmq` || {
  echo "${PX}Installing python-zmq..."
  pip install pyzmq

  if [ $? == 0 ]; then
    echo "${PX}Successfully installed python-zmq"
  else
    echo "${PX}Failed to install python-zmq"
  fi
}
#!/usr/bin/env bash
set -euxo pipefail

apt update
apt install -y wget curl git python3 build-essential

dpkg --add-architecture i386
mkdir -pm755 /etc/apt/keyrings
wget -O /etc/apt/keyrings/winehq-archive.key https://dl.winehq.org/wine-builds/winehq.key
wget -NP /etc/apt/sources.list.d/ https://dl.winehq.org/wine-builds/ubuntu/dists/jammy/winehq-jammy.sources
apt update
apt install -y --install-recommends winehq-devel

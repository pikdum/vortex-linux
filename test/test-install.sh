#!/usr/bin/env bash
set -euxo pipefail

PROTON_URL="https://github.com/GloriousEggroll/proton-ge-custom/releases/download/GE-Proton8-14/GE-Proton8-14.tar.gz"
VORTEX_URL="https://github.com/Nexus-Mods/Vortex/releases/download/v1.9.3/vortex-setup-1.9.3.exe"

DOTNET_URL="https://download.visualstudio.microsoft.com/download/pr/06239090-ba0c-46e2-ad3e-6491b877f481/c5e4ab5e344eb3bdc3630e7b5bc29cd7/windowsdesktop-runtime-6.0.21-win-x64.exe"

rm -rf ~/.vortex-linux/
../bin/vortex-linux downloadProton "$PROTON_URL"
PROTON_BUILD=$(ls -1d "$HOME/.vortex-linux/proton-builds/"*/ | xargs -n 1 basename)
../bin/vortex-linux downloadVortex "$VORTEX_URL"
VORTEX_INSTALLER=$(ls -1 "$HOME/.vortex-linux/vortex-installers/"*)

../bin/vortex-linux setProton "$PROTON_BUILD"
../bin/vortex-linux protonRunUrl "$DOTNET_URL" /q
../bin/vortex-linux setupVortexDesktop
../bin/vortex-linux installVortex "$VORTEX_INSTALLER"

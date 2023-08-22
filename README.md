# vortex-linux

wip cli for managing vortex on linux

## requirements

- GNU tar
- GNU Wget

## example

```console
$ ./vortex-linux downloadProton https://github.com/GloriousEggroll/proton-ge-custom/releases/download/GE-Proton8-3/GE-Proton8-3.tar.gz
Proton downloaded successfully!
$ ./vortex-linux setProton GE-Proton8-3
Proton set to: GE-Proton8-3
$ ./vortex-linux downloadVortex https://github.com/Nexus-Mods/Vortex/releases/download/v1.8.3/vortex-setup-1.8.3.exe
Vortex downloaded successfully!
$ ls -1 ~/.vortex-linux/proton-builds/
active
GE-Proton8-3
$ steam steam://install/1628350
steam.sh[61246]: Running Steam on pop 22.04 64-bit
steam.sh[61246]: STEAM_RUNTIME is enabled automatically
setup.sh[61316]: Steam runtime environment up-to-date!
steam.sh[61246]: Steam client's requirements are satisfied
$ ./vortex-linux setConfig STEAM_RUNTIME_PATH $HOME/.steam/steam/steamapps/common/SteamLinuxRuntime_sniper
{
  "STEAM_RUNTIME_PATH": "/home/pikdum/.steam/steam/steamapps/common/SteamLinuxRuntime_sniper"
}
$ ./vortex-linux protonRunUrl https://download.visualstudio.microsoft.com/download/pr/85473c45-8d91-48cb-ab41-86ec7abc1000/83cd0c82f0cde9a566bae4245ea5a65b/windowsdesktop-runtime-6.0.16-win-x64.exe /q
Running: /tmp/windowsdesktop-runtime-6.0.16-win-x64.exe /q
...
$ ./vortex-linux installVortex vortex-setup-1.8.3.exe
...
$ ./vortex-linux setupVortexDesktop
$ ./vortex-linux launchVortex
```

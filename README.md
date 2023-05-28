# vortex-linux

wip cli for managing vortex on linux

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
$ ./vortex-linux installVortex vortex-setup-1.8.3.exe
...
$ ./vortex-linux setupVortexDesktop
$ ./vortex-linux launchVortex
```

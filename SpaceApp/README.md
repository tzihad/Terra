# README

This app is built with cordova.

```
npm install -g cordova
```

Generate android releses with:- 
```
cordova platform add android
cordova build android --release
```
Generated file: `./platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk`


Generate Desktop releases with

```
cordava platform add electron
cordova build electron --release

```
Generated files: `./platforms/electron/build`

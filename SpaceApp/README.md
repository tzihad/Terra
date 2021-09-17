# README

This app is built with cordova.So first install cordava with `npm`

```
npm install -g cordova
```

Generate android releses with:- 
```
cordova platform add android
cordova build android --release
```
Generated file: `./platforms/android/app/build/outputs/apk/release/`


Generate Desktop releases with

```
cordava platform add electron
cordova build electron --release

```
Generated files: `./platforms/electron/build`

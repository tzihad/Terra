# README

obsolete

requirements 
`node v16.10.0`

The scripts used in the the npm commands are made for linux system. Though we have tried to make the build process crossplatform, there can be some issues.

This app is built with cordova.So first install cordava with `npm`

```console
npm run prepare
```

Generate android releses with:-

```console
npm run add-android
npm run build-app
```

Generated file: `./platforms/android/app/build/outputs/apk/release/`

Generate Desktop releases with

```console
npm run add-electron
npm run build-desktop

```

Generated files: `./platforms/electron/build`

Instant run

```console
npm test
```

Run android app

```console
npm run run-app
```

Run Electron release

```console
npm run run-desktop
```

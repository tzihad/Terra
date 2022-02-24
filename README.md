# Nasa Space Apps Challange | Terra

## Screenshots (hackathon build,only browser,as submitted)

<br>
<br>

[**Click here to view screenshots**](ScreenShots.md)

<br>
<br>

## Environment Preparation

- Install `nodejs v16.10.0` , `mongodb` and `python`
- Install required python modules using

```console
python -m pip install tensorflow pandas matplotlib
```

- Prepare workspace for building

```console
npm install -g cordova electron npm-run-all
npm run prepare

```

## Commands

### AIO

- `npm start` along with all backend, frontend running in localhost:8000

### Individually

- `npm run servers`: Start servers
- `npm run serve` : Serves the front end (localhost:8000)

Other commands (Does not give the guarantee to run perfectly on all platforms)

- `npm test`: Start servers, instant test UI
- `npm run app`: Start servers, run app
- `npm run desktop`: Start server, run release preview (desktop)
- `npm run build-app`: Start server, run app
- `npm run build-desktop`: Start server, run app
- `npm run appsta`: run app standalone
- `npm run dekstopsta`: run desktop-app standalone

## Workspace Overview

- `./Server/submission-server` : Handles input data(submission) and necessary communication for identification(login -token).
- `./Server/query-server` : Displays maps, data
- `./Server/Cronjob` : Caches data in to easily processable format, then send these data through query server.
- `./SpaceApp` Scale+ Portable frontend with Cordova

## Manual

### Access: 3 types of access

- Anonymous `no login required`
- User `login required` `can submit data`
- Govenment `login required` `can submit bulk data` `can deal help requests`

Generic User

```
username :general@email.com
password :General1
```

Generic Government Account

```
username :gov@gov.gov
password :GOVgov1
```

## Data Submission

By clicking a place on map (within 25 Km from user's geolocation) a signed in user can report self-assisted survey (with images), report landslides, ask for emergency help, provide recommendation to government.

These submitted data are added to the map layers with a 6 hour Cron-job loop. Emergency data are added to the map per 10 minutes. The accounts with `gov` tag can handle the emergency help requests.

Users with `gov` tag can submit survey data as csv format
*By submitting data one can earn contribution points and climb the global leaderboard*

## Data Visualization

The top left control group have a option to switch layers.With these layers one can visualize Landslide susceptibility, real time landslide risk, user submitted data. (The data-set we provided with is just a demo and have some sample feature points on Dhaka)

By clicking the feature point one can see the other data submitted with the form.

## Data Distribution

In the navigation bar there is a option to download whole dataset as CSV or GeoJSON . These data are free to distribute for research purpose.

## Safety Data

We include a potential general todo list for tackling landslide hazard.

## Privacy

We don't distribute any personal information with the bulk data

## Summary

The features mentioned there are only a subset of our main model. Due to lack of time and some other difficulties , we weren't able to materialize our full project. We were only able to make a basic scalable framework.
The cron job server can easily be used to generate prediction maps; the query server is able to send these to geojsons via API request from the client side (a mapnik rewrite will increase the performance). To learn more about our base plan please visit [Analysis](./Analysis).


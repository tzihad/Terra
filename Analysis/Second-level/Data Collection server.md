# Data collection server

* Mangaes login reg
* Provides auth token
* Inserts data into db
  * saves submission data with a unique id. saves geolocation and other data
  * saves images in ../images named with submission id_*
  * saves survey data as csv in ../data/survey/submission id.csv
  
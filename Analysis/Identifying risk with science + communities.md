# Identifying risk with science + communities

## Objectives

* Your challenge is to create **prototypes** and **methodologies** to *incorporate* Earth **observations** (as satellite data) with **local open data provided** by national entities and scientific institutes.
* participants are encouraged to include the information that the general public can contribute by capturing data in their territories to improve the precision of the analysis
* Finally, any *scalable* tool or prototype that meets the overall objective of this challenge **must potentially be** *implemented and executed* at a **low cost** by local governments.
* Build models that allow quantification of potential human losses and the cost of impacts from landslides.

## Objectives analysis

* Prototype:
  * Okay, so to put it simply, a prototype is just a model, a model to merge and link all data along with what have been already observed + building a new method of collecting data.
  * Most probably tools like this do exist. And goverment organisations have these tools.

  * First of all we need to choose the constraints that we will be working with (possible parameters list :  https://www.researchgate.net/publication/51641827_Application_of_remote_sensing_data_and_GIS_for_landslide_risk_assessment_as_an_environmental_threat_to_Izmir_city_west_Turkey#pf7) 
   * Then we are going to make two interfaces, one for collecting data from experts and one for collecting data from native people. In this case we need to make a system for information flow + analysis, and that's the prototype
   * or we may use bots to get parameters in realtime
* Data Manipulation:

  * We need to build a model with proper constraints.
  * need to feed a huge ammmount of data to the model
  * Compare the results with previous landslide occurances, test its accuracy
  * If val_accuray > 93%, we will save the training data

* Deployment:
  * UI for entring data/pictures/field inspection result
  * UI for displaying risk by analysing the data + possible ammount of deaths.
  * UI for accessin raw data and plotting these data for human anlayzation

* Data flow
  1. Government survey expert's field data -> our server
  2. Native people'd collected data -> our server
  3. data collected by bots(ptototype) -> (our server)
  4. (1) + (2) + (3) -> valiadte that data -> add it to our public database
  5. Input these data into our model -> calculate risks
  6 (5) -> plot these data into our model

## Challages: 

* Need to study geology, terrain parameters, landslide parmaters. Establish connection between these data. And then build the model.
* Need to think of an algorigthm to mark a cluster as a zone.
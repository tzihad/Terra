# Space debris

## Objectives

Your mission is to develop an open-source geospatial (i.e., map-based, or virtual globe-based) application that displays and locates every **known** debris object orbiting Earth, in real time.

## Objectives Analyzation

* We are provided with files containing orbital data of every known debris, like this one https://www.celestrak.com/norad/elements/1999-025.txt .

* Based on this data we will have to plot all these debrises in real time

* Calculating paths for every debrises in real time is very CPU intensive, So we may impelement ML for calculating this data.(I am not sure where to implement ML in this challage)

* Extra - Calculate possible collisions and birth of new debris-cloud/derbis cluster from  collission

### Why we will not be parsing raw telescope data

* Specialised telescpoes does not have full coverage of earth's orbitals. Some only produces parsable data in clear weather, some only works in night(not applicable to the radar/xray ..etc telescopes).

* We may not have 24/7 access to that data

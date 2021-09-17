# Marine Debris

## Objectives

1. Artificial Intelligence/Machine Learning (AI/ML) capabilities to monitor, detect, and quantify plastic marine debris
2. Report : Are there potential advantages as well as the limitations of utilizing AI/ML algorithms to quickly and inexpensively classify plastic pollution and report/visualize the findings in a publicly accessible way?
3. Your solution should input remote sensing data into a database that can be built into a dashboard to enable access to this information
4. Your solution should input remote sensing data into a database that can be built into a dashboard to enable access to this information. Create a visualization database based on AI/ML algorithms

## Obejtive Analyzation

* Remote Sensing Data(Sonar/image) - We need a physical prototype / bot for this/public app (or probably ocean space mst's tools) (or maybe they'll provide us with the data, )
* This bot/ tool will collect and send raw data to server
* Server will receive the data and pass it through the pretrained ML model.

* If it detects any plastic debris,it will include it in database
* The database should be able to meaningfully report(ML) the data.We need to create a app for this, and this app will be our frontend. This is the point where we can do something extra ordinary , ie:Merge data from other databases to train our model to predict some other extra information

## Challanges

* Multi tasks (bot / ML / UI / Server)
* Multiple models
* Very few training data-source (for early testing)
* labeling those data by hand

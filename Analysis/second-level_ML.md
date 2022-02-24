https://maps.nccs.nasa.gov/arcgis/apps/webappviewer/index.html?id=824ea5864ec8423fb985b33ee6bc05b7  
We may make low res tiled map for displaying prediction. so , our input data average / max pool will go through the model and will provide output for a array. And that array values depicted by colors would be our map.
We may train with small chunks, and will feed data in chunks. That's it for the model.

Extra Datasets
World terrain data

Model one -> calculate precipitation from satellite data/ grab from other source
Model two -> Calculate terrain properties from JAXA model
Model three -> Merge all data though DNN
Model four -> Megre all data from user provided data
Model five -> final prediction

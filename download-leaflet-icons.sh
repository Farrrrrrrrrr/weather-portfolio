#!/bin/bash

mkdir -p public
cd public

# Download Leaflet marker icons
wget -O marker-icon.png https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png
wget -O marker-icon-2x.png https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png
wget -O marker-shadow.png https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png

echo "Leaflet marker icons have been downloaded to the public directory."

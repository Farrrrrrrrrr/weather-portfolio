#!/bin/bash

# Install the required packages without the missing type definitions
npm install openweather-apis weather-js @types/weather-js --save

# If there are issues, we'll make our code more resilient
echo "Packages installed. If you encounter any issues, the app will use mock data as a fallback."

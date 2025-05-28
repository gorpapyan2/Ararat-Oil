@echo off
echo Installing madge if not present...
npm install madge --no-save

echo Checking for circular dependencies in src folder...
npx madge --circular --extensions js,jsx,ts,tsx ./src

echo Checking for circular dependencies in core components...
npx madge --circular --extensions js,jsx,ts,tsx ./src/core

echo Checking for circular dependencies in features...
npx madge --circular --extensions js,jsx,ts,tsx ./src/features

echo Done. 
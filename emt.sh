if test base/config.js 
then
   git pull;
else
   cp base/config.js.example base/config.js;
   npm i;
fi
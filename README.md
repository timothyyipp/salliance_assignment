

This is done with MongoDB <br/>
on administrator command prompt <br/>
open the C:\ directory --> cd C:\ <br/>
make a new directory for the database --> md \data\salliance <br/>
run the mongodb instance in the background --> "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath="c:\data\salliance" <br/>

npm install <br/>
npm install express mongoose passport-linkedin-oauth2 jsonwebtoken dotenv socket.io express-session cors axios<br/>

Note: <br/>
I believe in the .env files, you may not have access to the app I made on developer Linkedin (client_id and client_secret may be not authenticated if not logged in my linkedin account)<br/>

Difficulties:
Trying to access information about the user through the access token. <br/> 
--> I wasn't able to access the user info with " https://api.linkedin.com/v2/userinfo " and " https://api.linkedin.com/v2/me " as both were giving me: <br/>
"LinkedIn token error: { <br/>
  status: 403, <br/>
  serviceErrorCode: 100, <br/>
  code: 'ACCESS_DENIED', <br/>
  message: 'Not enough permissions to access: userinfo.GET.NO_VERSION' <br/>
}" <br/>
and I wasn't sure how to get the API to work even though I was successfully creating an access token <br/>
I can't really test the backend without the frontend. <br/>
--> I am not really used to any testing resources that do not contain the frontend <br/>
--> I do not know what how to test the program. <br/>
--> Not sure how to produce a working demo <br/>

Final Note: <br/>
I have done as much as I can and I am not sure if I can do anymore. 



# LinkedIn Chat Application Backend

This is a backend application for a LinkedIn-based chat application built with Node.js and Express.js. It supports LinkedIn OAuth login, real-time messaging using WebSockets, and chat history retrieval from a MongoDB database.

## Features

- **LinkedIn OAuth Login**: Users can log in using their LinkedIn accounts.
- **Real-time Messaging**: Users can send and receive messages in real-time.
- **Chat History**: Users can retrieve their chat history.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.io
- JSON Web Tokens (JWT)
- dotenv

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd linkedin-chat-backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```
   ```
   npm install express mongoose passport-linkedin-oauth2 jsonwebtoken dotenv socket.io express-session cors axios
   ```

4. Create a `.env` file in the root directory and add your LinkedIn API credentials and MongoDB connection string (file already made, just need to put in details):
  ```
  PORT=5000
  MONGO_URI=mongodb://127.0.0.1:27017/linkedin-chat
  JWT_SECRET=your_jwt_secret
  LINKEDIN_CLIENT_ID=your_client_id
  LINKEDIN_CLIENT_SECRET=your_client_secret
  REDIRECT_URI=http://127.0.0.1:5000/auth/linkedin/callback
  SCOPE=email profile
  ```

5. This is done with MongoDB <br/>
   On administrator command prompt, open the C:\ directory --> 
    ```
    cd C:\ 
    ```
   Make a new directory for the database --> 
    ```
    md \data\salliance
    ```
   Run the mongodb instance in the background --> 
    ```
    "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe" --dbpath="c:\data\salliance"
    ```

6. Start the server:
    ```
   npm start
    ```

7. Demonstrate callback
    ```
    curl -X POST http://localhost:5000/auth/linkedin
    ```
## Note: 
I believe in the .env files, you may not have access to the app I made on developer Linkedin (client_id and client_secret may be not authenticated if not logged in my linkedin account)<br/>

## Difficulties:
Trying to access information about the user through the access token. <br/> 
--> I wasn't able to access the user info with " https://api.linkedin.com/v2/userinfo " and " https://api.linkedin.com/v2/me " as both were giving me: <br/>
```
"LinkedIn token error: { 
  status: 403, 
  serviceErrorCode: 100, 
  code: 'ACCESS_DENIED', 
  message: 'Not enough permissions to access: userinfo.GET.NO_VERSION' 
}"
```
and I wasn't sure how to get the API to work even though I was successfully creating an access token <br/>
Testing: <br/>
--> I am not really used to any testing resources <br/>
--> I do not know what how to test the program. (Using postman, etc.)<br/>
--> Not sure how to produce a working demo <br/>

## Final Note:
I have done as much as I can and I am not sure if I can complete it. 

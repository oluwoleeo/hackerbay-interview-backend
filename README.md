#   hackerbay-interview-backend-task
A Express/Node backend microservice with the following features:

+   Authentication
+   JSON patching
+   Thumbnail generation

##  Getting started
Do the following: 
+   clone this repo to your local directory.
+   navigate to it and run `npm i` to install the packages
+   create a .env file and define the following environment variables in it:
    +   `TOKEN_SECRET = _string_`
    +   `SALTROUND = _integer_`
+   run `npm start` to start the application
+   run `npm test` to execute test suite
+   run `npm run coverage` to run test coverage

##  API endpoints
The base URL for the endpoints is *http://localhost:8080/api/vl/user*
    +   **/login**
        This endpoint takes a username and password pair and return a JSON object containing the user's unique token
    +   **/patchjson**
        This endpoint takes a JSON object and JSON patch object and returns an updated JSON object to the user
    +   **/generatethumbnail
        This endpoint takes a valid image URL and the desired image format and responds with a thumbnail of the image to the user.

The Swagger API documentation is available on http://localhost:8080/api-docs

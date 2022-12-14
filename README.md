# MERN Stack Project
Hello Everyone, I'm learning the MERN stack from this Udemy course down below, check it out!
[MERN Stack Front To Back](https://www.udemy.com/course/mern-stack-front-to-back)

## Description
* Will be pushing changes whenever I work on this project
* Will be deploying it on Vercel soon!

## Postman
* To work with the current backend functionalities, download [Postman](https://www.postman.com)!
* Clone the repository and run the command below:
   ```npm install```
* Run the server using the below command:
   ```npm run server```
* Copy the url generated for running the server and paste it in Postman after creating a new request! 

## Working
   ### User:
* For creating a user:
    * First, a user model is created to store the user data we need
    * Then, the data is sent via a POST request. express-validator is used to check various conditions
    * After validation, we check for duplicate emails. 
    * We then encrypt the password using Bcrypt
    * JWT is created to log the user into the website
* For logging in a user:
    * Same steps as above, except instead of creating a user, we will use the data to verify whether user exists or not
    * Bcrypt's compare() is used to compare a hashed password and a plain password to validate it.

   ### Profile
* For creating/updating a profile:
   * First, we pass the check function in the POST request
   * Then in the async arrow function, we check if there are any errors
   * Then the profileFields and social objects are created to get the data from the POST request
   * We find the respective profile using Profile.findOne() function
   * If there exists a profile, we need to update it, hence we call Profile.findOneAndUpdate() and then save it
   * Otherwise, we create a new profile by creating a new Profile object with above parameters
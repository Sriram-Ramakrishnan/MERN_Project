# MERN Stack Project
Hello Everyone, I'm learning the MERN stack from this Udemy course down below, check it out!
[MERN Stack Front To Back](https://www.udemy.com/course/mern-stack-front-to-back)

## Description
* Will be pushing changes whenever I work on this project
* Will be deploying it on Vercel soon!
   
## Get started with the project!
   * Clone the repository and run the command below:
      ```npm install```

   * For using the project, you will need 2 applications as of now:
   #### MongoDB
   * Get started with MongoDB and create an account!
   * Create a new cluster. After it has been created, click on Connect and select MongoDB Driver
   * A connection string will be generated, you will be using that to connect MongoDB!
   * Create a file ```default.json``` inside the config folder
   * Inside that file, add 
   ```json
   {
      "mongoURI" : "<your_MongoDB_connection_string>"
   }
   ```
   #### Postman
   * To work with the current backend functionalities, download [Postman](https://www.postman.com)!

   * Run the server using the below command:
      ```npm run server```
   * Copy the url generated for running the server and paste it in Postman after creating a new request! 



## Working
   ### User
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
* For fetching all user profiles / fetching one by user_id:
   * Using the Schema class function find(), we can get all profiles which exists on the database and return it in the response
   * As for the specific profile, we pass the user_id in the url and use findOne() function to fetch it if exists and return it in the response.

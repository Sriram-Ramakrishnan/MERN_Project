# MERN Stack Project
Hello Everyone, I'm learning the MERN stack from this Udemy course down below, check it out!
[MERN Stack Front To Back](https://www.udemy.com/course/mern-stack-front-to-back)

## Description
* Will be pushing changes whenever I work on this project
* Will be deploying it on Vercel soon

## Working
* For creating a user:
    * First, a user model is created to store the user data we need
    * Then, the data is sent via a POST request. express-validator is used to check various conditions
    * After validation, we check for duplicate emails. 
    * We then encrypt the password using Bcrypt
    * JWT is created to log the user into the website
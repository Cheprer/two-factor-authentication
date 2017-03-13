# Two Factor Authentication
I've created simple 2 factor authentication example how it could be implemented using hapi and speakeasy(Google Authenticator).
Views based on this project: https://github.com/dwyl/hapi-login-example

## How to use it

### Preconditions
Please make sure you have installed canvas to successfully to be able to initialize all packages
Here is how: https://github.com/Automattic/node-canvas

`npm i`

`npm start`

### Steps

1. Login with simple authentication
http://localhost:8000/ or http://localhost:8000/login
In memory user:
email: simple@be.org
password: <same as email>

2. Get token from response and generate google auth secret
http://localhost:8000/admin/googleauth?token=<token value from response after login>

3. Scan QR
Scan QR code to your Google Authenticator or add manually secret and enter 6 digit number and press verify

4. Repeat step 1. you should be asked to add code from Google Authenticator after entering the credentials in a first step

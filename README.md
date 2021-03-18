This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `Cypress instructions`

npm install                      -> install nodejs npm packages

npm install --save-dev cypress   -> to install cypress

npx cypress open                 -> to open cypress studio. This will create cypress folder structure with integration folder. 

npx cypress run                  -> to run cypress tests on terminal

cypress run --record --key ba932e5c-a6c9-4beb-897f-9210989da13d  -> Run cypress test and record on cypress dashboard



### `Cypress instructions for cypress.json file to configure running orderly list of test scritps`




{
  
  "baseUrl": "http://localhost:3000", 
  
  
  "projectId": "oo6g6k", --> This is only required for dashboard. 
  
 
 
 "testFiles": [
 
    "02-before_each.spec.js",
    
    "01-first_test.spec.js",
    
    "03-aliasing.spec.js",
    
    "04-max_char_input.spec.js",
    
    "05-results.spec.js",
    
    "06-interactions.spec.js",
    
    "07-selecting.spec.js"    

  ]
}



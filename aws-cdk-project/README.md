# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template



## Steps to create Aws CDK project

1. Make sure you have AWS CLI installed and configured with access keys/security key. 
2. create an empty dir (e.g. aws-cdk-project which is already provided in this project if you clone) 
3. npm init and npm install (to create node_module)
4. npm install -g typescript 
5. npm install aws-cdk  
6. npx cdk init app - - language typescript  > this will initialise a project with aws cdk with typescript)
7. npm i @aws-cdk/aws-s3  > this will makesure you can work with s3 cdk commands.
8. Add your code at project/lib/aws-cdk-demo-stack.ts file to define your assets/stack. e.g. define s3 bucket, cloud front configurations etc.
9. npx cdk bootstrape  >  creates a staging bucket 
10.npx cdk synth       >  synthesize the chageset and compile AWS CDK application into an AWS CloudFormation template.  
11.npx cdk deploy      >  deploys the stack 
12.

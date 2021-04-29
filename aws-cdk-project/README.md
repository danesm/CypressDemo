# Welcome to example AWS CDK TypeScript project!

https://github.com/danesm/CypressDemo/blob/5672b55f113e2993fd5a8a15e98ee829f05e347e/aws-cdk-project/CDK.png

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template
- `cdk bootstrap` creats stagin bucket on your account

## Steps to create Aws CDK project by @danesm

1. Make sure you have AWS CLI installed and aws profile configured with access keys/security key. To check this > aws configure list
2. Create an empty dir (e.g. aws-cdk-project which is already provided in this project if you clone)
3. npm init and npm install (to create node_module)
4. npm install -g typescript
5. npm install -g aws-cdk
6. cdk init app - - language typescript > this will initialise aws cdk project using typescript)
7. npm i @aws-cdk/aws-s3 > this will makesure you can work with s3 cdk commands.
8. npm i @aws-cdk/aws-cloudfront
9. npm i @aws-cdl/aws-s3-deployment
10. Add your stack at '/lib/dev-stack.ts or test-stack.ts. e.g. define s3 bucket, cloudfront configurations etc.
11. cdk bootstrape > creates a staging bucket on target aws account/region.
12. cdk synth > synthesize meaning compile AWS CDK code into an AWS CloudFormation template.
13. cdk deploy > deploys the stack.
14. cdk diff > optional and only needed if you want to check if there is any difference in you CDK code stack & actual stack created.
15. cdk destroy > this will delete all resources that were created by above steps.

## Above CDK commands works with default aws account configured. But how about dealing with multiple accounts and environments.

1. cdk bootstrap --profile yourdevprofilename
2. cdk synth --profile yourdevprofilename
3. cdk deploy --app 'cdk.out/' DevStack --profile yourdevprofilename or cdk deploy DevStack --profile awsprofilename.
4. cdk destroy DevStack --profile yourdevprofilename

Tips:

1. CDK project doesn't have to be in the same repo as your reactjs project.
2. CI/CD server that is running CDK must have AWS CLI and Node installed.
3. Use following CDK documentation for sample code snippet for other aws resources https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-cloudfront.CloudFrontWebDistribution.html
4. Define your stack for each environment on different /lib/\*.ts file and configure properties from cdk.json e.g. bucket_name

#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsCdkProjectStack } from '../lib/aws-cdk-project-stack';

const app = new cdk.App();


new AwsCdkProjectStack(app, 'NovartisTest',{env: { account: '767322885366', region: 'us-east-1' }});
new AwsCdkProjectStack(app, 'NovartisDev',{env: { account: '211826912675', region: 'eu-west-2' }});





//new AwsCdkProjectStack(app, 'AwsCdkProjectStack');


/*
multiple stacks with the same name in different accounts/regions. Consider following example code:

const app = new cdk.App()
new cdk.Stack(app, 'test1', { stackName: 'test', env: { account: 'XXXXXXXXXXXX', region: 'eu-west-1' } })
new cdk.Stack(app, 'test2', { stackName: 'test', env: { account: 'XXXXXXXXXXXX', region: 'us-east-1' } })
*/
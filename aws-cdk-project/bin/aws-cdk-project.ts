#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { DevStack } from "../lib/dev-stack";
import { TestStack } from "../lib/test-stack";

const app = new cdk.App();

new DevStack(app, "DevStack", {
  env: { account: "211826912675", region: "us-east-1" },
});

new TestStack(app, "TestStack", {
  env: { account: "767322885366", region: "us-east-1" },
});

/*
multiple stacks with the same name in different accounts/regions. Consider following example code:

const app = new cdk.App()
new cdk.Stack(app, 'test1', { stackName: 'test', env: { account: 'XXXXXXXXXXXX', region: 'eu-west-1' } })
new cdk.Stack(app, 'test2', { stackName: 'test', env: { account: 'XXXXXXXXXXXX', region: 'us-east-1' } })
*/

#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { DevStack } from "../lib/dev-stack";
import { TestStack } from "../lib/test-stack";

const app = new cdk.App();

const dev_account = app.node.tryGetContext("dev_account");
const dev_region = app.node.tryGetContext("dev_region");

new DevStack(app, "DevStack", {
  env: { account: dev_account, region: dev_region },
});

new TestStack(app, "TestStack", {
  env: { account: "767322885366", region: "us-east-1" },
});

/*
multiple stacks with the same name in different accounts/regions. another example code:

const app = new cdk.App()
new cdk.Stack(app, 'test1', { stackName: 'test', env: { account: 'XXXXXXXXXXXX', region: 'eu-west-1' } })
new cdk.Stack(app, 'test2', { stackName: 'test', env: { account: 'XXXXXXXXXXXX', region: 'us-east-1' } })
*/

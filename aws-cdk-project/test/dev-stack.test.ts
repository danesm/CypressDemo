import { SynthUtils } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import { DevStack } from "../lib/dev-stack";

test("create dev-stack", () => {
  const app = new cdk.App();

  const dev_account = app.node.tryGetContext("dev_account");
  const dev_region = app.node.tryGetContext("dev_region");

  const devStack = new DevStack(app, "DevStack", {
    env: { account: dev_account, region: dev_region },
  });

  expect(SynthUtils.toCloudFormation(devStack)).toMatchSnapshot();
});

#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsCdkProjectStack } from '../lib/aws-cdk-project-stack';

const app = new cdk.App();
new AwsCdkProjectStack(app, 'AwsCdkProjectStack');

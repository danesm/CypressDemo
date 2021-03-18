import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as s3Deploy from '@aws-cdk/aws-s3-deployment';

import * as cloudfront from '@aws-cdk/aws-cloudfront';


export class AwsCdkProjectStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    //create s3 bucket

    const dbmBucket = new s3.Bucket(this,'dbm-testbucket-20210217', {
                  publicReadAccess: true,
                  websiteIndexDocument: 'index.html'

    });

   // Deploy code from build folder to s3.


   new s3Deploy.BucketDeployment(this, 'dbm-testbucketDeploy-20210218', {
    sources: [s3Deploy.Source.asset('../build')],
    destinationBucket: dbmBucket
    //destinationKeyPrefix: 'web/static' // optional prefix in destination bucket
  });


  //Cloud Front Confgiuration.
  
   new cloudfront.CloudFrontWebDistribution(this, 'DBMDistribution', {
    originConfigs: [
      {
        s3OriginSource: {
        s3BucketSource: dbmBucket
        },
        behaviors : [ {isDefaultBehavior: true}]
      }
    ]
  });
   
  





  }
}

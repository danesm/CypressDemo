import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import { Duration } from "@aws-cdk/core";

export class AwsCdkProjectStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const bucket_name = this.node.tryGetContext("bucket_name");

    //create s3 bucket

    //const dbmBucket = new s3.Bucket(this,'dbm-testbucket-20210217', {
    const dbmBucket = new s3.Bucket(this, bucket_name, {
      publicReadAccess: false,
      websiteIndexDocument: "index.html",
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Deploy code from build folder to s3.

    new s3Deploy.BucketDeployment(this, "dbmbucketDeploy-20210218", {
      sources: [s3Deploy.Source.asset("../build")],
      destinationBucket: dbmBucket,
      cacheControl: [s3Deploy.CacheControl.maxAge(Duration.seconds(60))],
      //destinationKeyPrefix: 'web/static' // optional prefix in destination bucket
    });

    //Cloud Front Confgiuration.

    //Create new origin access identity - a cloudfront user
    const oia = new cloudfront.OriginAccessIdentity(this, "OIA", {
      comment: "Created by dbm CDK",
    });

    //Grant readonly access to origin bucket for cloudfront.
    dbmBucket.grantRead(oia);

    const cloudfrontobj = new cloudfront.CloudFrontWebDistribution(
      this,
      "DBMDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: dbmBucket,
              originAccessIdentity: oia,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
      }
    );

    // dbmBucket.grantReadWrite(cloudfrontobj);
  }
}

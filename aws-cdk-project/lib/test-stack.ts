import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import { Duration } from "@aws-cdk/core";
import { AllowedIPsWaf, IPScope, IPv4 } from "allowed-ips-waf";

export class TestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that dev env configuration from cdk.json file.

    const bucket_name = this.node.tryGetContext("test_bucket_name");

    //create s3 bucket.

    const testBucket = new s3.Bucket(this, bucket_name, {
      publicReadAccess: false,
      websiteIndexDocument: "index.html",
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Deploy code from build folder to s3.

    new s3Deploy.BucketDeployment(this, "TestBuildDeployBucket", {
      sources: [s3Deploy.Source.asset("../build")],
      destinationBucket: testBucket,
      cacheControl: [s3Deploy.CacheControl.maxAge(Duration.seconds(60))],
      //destinationKeyPrefix: 'web/static' // optional prefix in destination bucket
    });

    //Cloud Front Confgiuration.

    // WAF Config

    const whitelistIP1 = this.node.tryGetContext("test_whitelist_ip1");
    const whitelistIP2 = this.node.tryGetContext("test_whitelist_ip2");

    const allowedIPsWaf = new AllowedIPsWaf(this, "AllowedIPsWaf", {
      ipScope: IPScope.CLOUDFRONT,
      allowedIPs: [new IPv4(whitelistIP1), new IPv4(whitelistIP2)],
    });

    //Create new origin access identity - a cloudfront user who can access the bucket.
    const oia = new cloudfront.OriginAccessIdentity(this, "OIA", {
      comment: "Created by Test CDK",
    });

    //Grant readonly access to origin bucket for cloudfront.
    testBucket.grantRead(oia);

    const cloudfrontobj = new cloudfront.CloudFrontWebDistribution(
      this,
      "TestDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: testBucket,
              originAccessIdentity: oia,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        //Implements Ip Whitelisting.
        webACLId: allowedIPsWaf.webACLId,
        //Enable cloudfront access log (standard logging) with a default logging bucket.
        loggingConfig: {},
      }
    );
  }
}

import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import { Duration } from "@aws-cdk/core";
import { AllowedIPsWaf, IPScope, IPv4 } from "allowed-ips-waf";

export class DevStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that dev env configuration from cdk.json file.

    const bucket_name = this.node.tryGetContext("dev_bucket_name");

    //create s3 bucket.

    const devBucket = new s3.Bucket(this, bucket_name, {
      publicReadAccess: false,
      websiteIndexDocument: "index.html",
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Deploy code from build folder to s3.

    new s3Deploy.BucketDeployment(this, "DevBuildDeployBucket", {
      sources: [s3Deploy.Source.asset("../build")],
      destinationBucket: devBucket,
      cacheControl: [s3Deploy.CacheControl.maxAge(Duration.seconds(60))],
      //destinationKeyPrefix: 'web/static' // optional prefix in destination bucket
    });

    //Cloud Front Confgiuration.

    // WAF Config
    const allowedIPsWaf = new AllowedIPsWaf(this, "AllowedIPsWaf", {
      ipScope: IPScope.CLOUDFRONT,
      allowedIPs: [new IPv4("52.94.36.28/32"), new IPv4("54.240.0.0/16")],
    });

    //Create new origin access identity - a cloudfront user
    const oia = new cloudfront.OriginAccessIdentity(this, "OIA", {
      comment: "Created by Dev CDK",
    });

    //Grant readonly access to origin bucket for cloudfront.
    devBucket.grantRead(oia);

    const cloudfrontobj = new cloudfront.CloudFrontWebDistribution(
      this,
      "DevDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: devBucket,
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

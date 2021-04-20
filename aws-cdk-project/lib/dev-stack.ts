import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import { Duration } from "@aws-cdk/core";
import * as wafv2 from "@aws-cdk/aws-wafv2";

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

    const whitelistIP1 = this.node.tryGetContext("dev_whitelist_ip1");
    const whitelistIP2 = this.node.tryGetContext("dev_whitelist_ip2");

    const webAcl = new wafv2.CfnWebACL(this, "WebAcl", {
      defaultAction: { allow: {} },
      description: "LEAP PnC Web ACL",
      tags: [{ key: "LEAP", value: "Web ACL for LEAP PnC" }],
      rules: [
        {
          priority: 1,
          overrideAction: { none: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: "AWS-AWSManagedRulesAmazonIpReputationList",
          },
          name: "AWS-AWSManagedRulesAmazonIpReputationList",
          statement: {
            managedRuleGroupStatement: {
              vendorName: "AWS",
              name: "AWSManagedRulesAmazonIpReputationList",
            },
          },
        },
        {
          priority: 2,
          overrideAction: { none: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: "AWS-AWSManagedRulesCommonRuleSet",
          },
          name: "AWS-AWSManagedRulesCommonRuleSet",
          statement: {
            managedRuleGroupStatement: {
              vendorName: "AWS",
              name: "AWSManagedRulesCommonRuleSet",
            },
          },
        },
        {
          priority: 3,
          overrideAction: { none: {} },
          visibilityConfig: {
            sampledRequestsEnabled: true,
            cloudWatchMetricsEnabled: true,
            metricName: "AWS-AWSManagedRulesKnownBadInputsRuleSet",
          },
          name: "AWS-AWSManagedRulesKnownBadInputsRuleSet",
          statement: {
            managedRuleGroupStatement: {
              vendorName: "AWS",
              name: "AWSManagedRulesKnownBadInputsRuleSet",
            },
          },
        },
      ],
      scope: "CLOUDFRONT",
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: "web-acl",
      },
    });

    //IpRule-Allow list
    new wafv2.CfnIPSet(this, "LEAP_IPrule", {
      addresses: [whitelistIP1, whitelistIP2],
      ipAddressVersion: "IPV4",
      scope: "CLOUDFRONT",
      description: "LEAP PnC IP Allow List",
      tags: [{ key: "LEAP", value: "IPSet for LEAP PnC" }],
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
        webACLId: webAcl.attrArn,
        //Enable cloudfront access log (standard logging) with a default logging bucket.
        loggingConfig: {},
      }
    );
  }
}

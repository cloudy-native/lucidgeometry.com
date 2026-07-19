import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { S3StaticWebsiteOrigin } from "aws-cdk-lib/aws-cloudfront-origins";
import { ARecord, HostedZone, RecordTarget } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export interface LucidGeometryStackProps extends StackProps {
  domainName: string;
}

export class LucidGeometryStack extends Stack {
  constructor(scope: Construct, id: string, props: LucidGeometryStackProps) {
    super(scope, id, props);

    const { domainName } = props;

    const bucket = new Bucket(this, "WebsiteBucket", {
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "error.html",
      publicReadAccess: true,
      blockPublicAccess: new BlockPublicAccess({
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      }),
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const zone = HostedZone.fromLookup(this, "Zone", {
      domainName,
    });
    const certificate = new Certificate(this, "SiteCertificate", {
      domainName,
      validation: CertificateValidation.fromDns(zone),
    });

    const distribution = new Distribution(this, "SiteDistribution", {
      defaultBehavior: {
        origin: new S3StaticWebsiteOrigin(bucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        compress: true,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: CachePolicy.CACHING_OPTIMIZED,
      },
      domainNames: [domainName],
      certificate: certificate,
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 403,
          responsePagePath: "/error.html",
        },
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: "/error.html",
        },
      ],
    });

    new ARecord(this, "SiteAliasRecord", {
      recordName: domainName,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone: zone,
    });

    new ARecord(this, "WWWAliasRecord", {
      recordName: `www.${domainName}`,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone: zone,
    });

    // Site files are deployed via root package scripts (build + aws s3 sync),
    // not BucketDeployment — dist/ is too large for the custom-resource Lambda.

    new CfnOutput(this, "BucketName", {
      value: bucket.bucketName,
    });

    new CfnOutput(this, "WebsiteUrl", {
      value: bucket.bucketWebsiteUrl,
    });

    new CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
    });

    new CfnOutput(this, "DistributionDomainName", {
      value: distribution.distributionDomainName,
    });

    new CfnOutput(this, "SiteURL", {
      value: `https://${domainName}`,
    });
  }
}

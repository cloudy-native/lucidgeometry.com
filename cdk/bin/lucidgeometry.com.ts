#!/opt/homebrew/opt/node/bin/node
import { App, Environment } from "aws-cdk-lib";
import { LucidGeometryStack } from "../lib/lucidgeometry.com-stack";

const app = new App();

const env: Environment = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const domainName = "lucidgeometry.com";

new LucidGeometryStack(app, "LucidGeometryStack", {
  env,
  domainName,
});

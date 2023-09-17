import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { DynamoDBTable } from './dynamodb-table';  
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwsToDoAppCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new DynamoDBTable(this, 'DynamoDBTableConstruct')
  }
}

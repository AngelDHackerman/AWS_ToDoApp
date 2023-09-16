import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class DynamoDBTable extends cdk.Construct { 
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) { 
    super(scope, id);

    // Creating the DynamoDb table named: ToDoTable
    new dynamodb.Table(this, 'ToDoTable', { 
      partitionKey: {name: 'taskId', type: dynamodb.AttributeType.STRING },

    })
  }
}
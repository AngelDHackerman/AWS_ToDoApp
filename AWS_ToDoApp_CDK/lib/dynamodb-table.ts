import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class DynamoDBTable extends cdk.Construct { 
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) { 
    super(scope, id);

    // Creating the DynamoDb table named: ToDoTable
    new dynamodb.Table(this, 'ToDoTable', { 
      partitionKey: {name: 'taskId', type: dynamodb.AttributeType.STRING },
      sortKey: {name: 'dueDate', type: dynamodb.AttributeType.STRING},  // Clave de clasificacion basada en la fecha de vencimiento
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,  // Capacidad bajo demanda 
      
    })
  }
}
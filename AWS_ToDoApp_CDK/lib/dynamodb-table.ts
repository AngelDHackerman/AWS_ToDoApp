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
      removalPolicy: cdk.RemovalPolicy.DESTROY,  // Elimina la tabla si se elimina el stack
      timeToLiveAttribute: 'expiryDate',  // Atributo TTL para eliminacion automatica(necesario agregar el timestamp en los elementos agregados)
      pointInTimeRecovery: true,  // Punto de recuperacion (proteje las tablas de eliminaciones o modificiaciones accidentales)
      
    })
  }
}
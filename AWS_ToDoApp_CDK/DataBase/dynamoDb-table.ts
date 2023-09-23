import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DynamoDBTable extends Construct { 
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) { 
    super(scope, id);

    this.table = new dynamodb.Table(this, 'ToDoTable', { 
      partitionKey: {name: 'taskId', type: dynamodb.AttributeType.STRING },
      sortKey: {name: 'timeStamp', type: dynamodb.AttributeType.STRING},  // Cambiado de 'dueDate' a 'timeStamp'
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,  
      removalPolicy: cdk.RemovalPolicy.DESTROY,  
      timeToLiveAttribute: 'expiryDate',  
      
      pointInTimeRecovery: true,  
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    // Agregar un índice global secundario para el atributo 'status'
    this.table.addGlobalSecondaryIndex({
      indexName: 'StatusIndex',  
      partitionKey: { name: 'status', type: dynamodb.AttributeType.STRING },  
      sortKey: { name: 'timeStamp', type: dynamodb.AttributeType.STRING },  // Cambiado de 'dueDate' a 'timeStamp'
      projectionType: dynamodb.ProjectionType.ALL, 
    });

    // Opcional: Agregar un índice global secundario para el atributo 'dueDate' si aún necesitas hacer consultas basadas en esta propiedad
    this.table.addGlobalSecondaryIndex({
      indexName: 'DueDateIndex',  
      partitionKey: { name: 'taskId', type: dynamodb.AttributeType.STRING },  
      sortKey: { name: 'dueDate', type: dynamodb.AttributeType.STRING },  
      projectionType: dynamodb.ProjectionType.ALL, 
    });
  }
}

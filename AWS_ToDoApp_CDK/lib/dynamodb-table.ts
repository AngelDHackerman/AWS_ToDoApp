// Esta base de datos tendra una llave primaria con los atributos de taskId y dueDate, asi tambien un expiryDate (de 7 dias segun nuestra funcion lambda)

import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DynamoDBTable extends Construct { 
  public readonly table: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) { 
    super(scope, id);

    this.table = new dynamodb.Table(this, 'ToDoTable', { 
      partitionKey: {name: 'taskId', type: dynamodb.AttributeType.STRING },
      sortKey: {name: 'dueDate', type: dynamodb.AttributeType.STRING},  // Clave de clasificacion basada en la fecha de vencimiento
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,  // Capacidad bajo demanda 
      removalPolicy: cdk.RemovalPolicy.DESTROY,  // Elimina la tabla si se elimina el stack
      timeToLiveAttribute: 'expiryDate',  // Atributo TTL para eliminacion automatica(necesario agregar el timestamp en los elementos agregados)
      
      // Punto de recuperacion (proteje las tablas de eliminaciones o modificiaciones accidentales)
      pointInTimeRecovery: true,  
      // Habilitar un stream de DynamoDB y mostrar ambas imágenes (anterior y nueva)
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    })

    // Agregar un indice global secundario para el atributo 'status'
    this.table.addGlobalSecondaryIndex({
      indexName: 'StatusIndex',  // Nombre unico para el GSI 
      partitionKey: { name: 'status', type: dynamodb.AttributeType.STRING },  // clave de particion para el GSI basada en el estado
      sortKey: { name: 'dueDate', type: dynamodb.AttributeType.STRING },  // Usamos 'dueDate' como clave de clasificacion para el GSI
      projectionType: dynamodb.ProjectionType.ALL, // tipo de proyeccion (en este caso, queremos todos los atributos del item)
    });
  }
}
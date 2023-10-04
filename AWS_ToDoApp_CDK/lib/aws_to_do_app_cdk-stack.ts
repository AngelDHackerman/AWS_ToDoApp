import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { DynamoDBTableV2 } from './DataBase/dynamoDb-table';  // <- agregando nueva base de datos con nueva estructrura
import * as path from 'path'; 
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class AwsToDoAppCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoTableV2 = new DynamoDBTableV2(this, 'DynamoDBTableConstructV2');  // <- nuevo construct

    // Creando la funcion 'create-task'
    const createTaskFunction = new lambda.Function(this, 'CreateTaskFunction', {  // está indicando que el código fuente para la función AWS Lambda CreateTaskFunction se encuentra en un directorio llamado lambda que está al mismo nivel que el directorio del archivo que contiene tu clase AwsToDoAppCdkStack. 
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'create-task.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: { 
        TABLE_NAME: dynamoTableV2.table.tableName   // con esta linea estamos configurando una variable de entorno llamada TABLE_NAME para la funcion lambda. 
      }
    });

    // Otorgar permisos a la funcion Lambda para escribir en la tabla DynamoDB
    dynamoTableV2.table.grantWriteData(createTaskFunction);
    dynamoTableV2.table.grantReadData(createTaskFunction);

    // Definir la nueva funcion Lambda 'get-task-by-status' (que busca porque query las task segun su status)
    const getTaskFunction = new lambda.Function(this, 'GetTaskByStatusFunction', { 
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'get-task-by-status.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: { 
        TABLE_NAME: dynamoTableV2.table.tableName 
      },
    });

    // Otorgar permisos a la funcion Lambda para leer de la tabla DynamoDB
    dynamoTableV2.table.grantReadData(getTaskFunction);

    // Definir la funcion 'get-task-by-id' que regresara las tareas segun su ID. 
    const getTaskByIdFunction = new lambda.Function(this, 'GetTaskByIdFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'get-task-by-id.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: { 
        TABLE_NAME: dynamoTableV2.table.tableName 
      },
    });

    // Otorgar permisos a la funcion getTaskById
    dynamoTableV2.table.grantReadData(getTaskByIdFunction);

    // Definir la funcion 'update-task' que actualizara las tareas
    const updateTaskByIdFunction = new lambda.Function(this, 'updateTaskByIdFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'update-task.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        TABLE_NAME: dynamoTableV2.table.tableName 
      },
    });

    // otorgar permisos a la funcion updateTaskById
    dynamoTableV2.table.grantWriteData(updateTaskByIdFunction)
    dynamoTableV2.table.grantReadData(updateTaskByIdFunction);

    // Definir funcion 'delete-task' para eliminar tareas
    const deleteTaskFunction = new lambda.Function(this, 'deleteTaskFunction', { 
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'delete-task.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: { 
        TABLE_NAME: dynamoTableV2.table.tableName
      },
    });

    // Otorgar permisos a la función Lambda para eliminar elementos de la tabla DynamoDB
    dynamoTableV2.table.grant(deleteTaskFunction, 'dynamodb:DeleteItem');

    // Creando butcket S3 para la app React
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
    });

    // Creando una distribucion de cloudFront
    const distribution = new cloudfront.Distribution(this, 'WebsiteDistribution', {
      defaultBehavior: { origin: new origins.S3Origin(websiteBucket) },
    });
  }
}

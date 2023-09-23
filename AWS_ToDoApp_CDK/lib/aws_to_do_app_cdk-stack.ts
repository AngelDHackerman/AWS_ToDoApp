import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { DynamoDBTable } from './dynamodb-table';  
import * as path from 'path'; 

export class AwsToDoAppCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoTable = new DynamoDBTable(this, 'DynamoDBTableConstruct');

    // Creando la funcion 'create-task'
    const createTaskFunction = new lambda.Function(this, 'CreateTaskFunction', {  // está indicando que el código fuente para la función AWS Lambda CreateTaskFunction se encuentra en un directorio llamado lambda que está al mismo nivel que el directorio del archivo que contiene tu clase AwsToDoAppCdkStack. 
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'create-task.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: { 
        TABLE_NAME: dynamoTable.table.tableName  // con esta linea estamos configurando una variable de entorno llamada TABLE_NAME para la funcion lambda. 
      }
    });

    // Otorgar permisos a la funcion Lambda para escribir en la tabla DynamoDB
    dynamoTable.table.grantWriteData(createTaskFunction);

    // Definir la nueva funcion Lambda 'get-task' (que busca porque query las task segun su status)
    const getTaskFunction = new lambda.Function(this, 'GetTaskFunction', { 
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'get-task.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: { 
        TABLE_NAME: dynamoTable.table.tableName
      },
    });

    // Otorgar permisos a la funcion Lambda para leer de la tabla DynamoDB
    dynamoTable.table.grantReadData(getTaskFunction);

    // Definir la funcion 'get-task-by-id' que regresara las tareas segun su ID. 
    const getTaskByIdFunction = new lambda.Function(this, 'GetTaskByIdFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'get-task-by-id.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: { 
        TABLE_NAME: dynamoTable.table.tableName
      },
    });

    // Otorgar permisos a la funcion getTaskById
    dynamoTable.table.grantReadData(getTaskByIdFunction);

    // Definir la funcion 'update-task' que actualizara las tareas
    const updateTaskByIdFunction = new lambda.Function(this, 'updateTaskByIdFunction', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'update-task.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      environment: {
        TABLE_NAME: dynamoTable.table.tableName
      }
    })
  }
}

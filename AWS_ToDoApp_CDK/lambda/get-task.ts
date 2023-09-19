// Esta lambda funcion, tomara las tareas segun su status: pending, completed, working, deleted.

import { TaskStatus } from './task-status'

// Lambda interface que aceptara un parametro opcional `status` para filtrar tareas. 
interface LambdaEvent { 
  queryStringParameters?: { 
    status?: string;
  };
}

import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();

export.handler = async (event: LambdaEvent) => {
  const status = event.queryStringParameters?.status;

  // Validar el status si esta presente, viendo si status es una clave del enum TaskStatus
  if (status && !(status in TaskStatus)) { 
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid status value' })
    }
  }
}
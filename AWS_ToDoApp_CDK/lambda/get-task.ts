// Esta lambda funcion, tomara las tareas segun su status: pending, completed, working, deleted.

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
  if (status) { 
    
  }
}
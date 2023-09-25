// Esta lambda funcion, tomara las tareas segun su status: pending, completed, working, deleted.
// Con este código, la función Lambda get-task requerirá un parámetro status en la consulta. 
// Si no se proporciona, devolverá un error. Si se proporciona un status, 
// la función usará el GSI StatusIndex para recuperar las tareas que coincidan con ese status.

// TODO: Refactor for dependency injection, now wer are crearting an instance of the DynamoDb table for each lambda function

import { TaskStatus } from './utils/task-status'

// Lambda interface que aceptara un parametro opcional `status` para filtrar tareas. 
interface LambdaEvent { 
  queryStringParameters?: { 
    status?: string;
  };
}

import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: LambdaEvent) => {
  const status = event.queryStringParameters?.status;

  // Validar el status si esta presente, viendo si status es una clave del enum TaskStatus
  if (status && !Object.values(TaskStatus).includes(status as TaskStatus)) { 
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid status value' })
    };
  }

  // Si no se proporciona un status, devuelve un error
  if (!status) { 
    return { 
      statusCode: 400,
      body: JSON.stringify({ error: 'Status parameter is requiered' }),
    };
  }

  // Todo: Agregar validacion para ver si hay alguna tarea con el status pedido. Sino la hay dar un mensaje de alerta

  // Configura los parametros para la consulta usando el GSI global secondary index
  const params: AWS.DynamoDB.DocumentClient.QueryInput = { 
    TableName: process.env.TABLE_NAME!, 
    IndexName: 'StatusIndex',
    KeyConditionExpression: '#statusAttribute = :statusValue', // Usamos un alias para "status"
    ExpressionAttributeNames: {
        '#statusAttribute': 'status', // Definimos el alias de status
    },
    ExpressionAttributeValues: {
        ':statusValue': status, // Aquí no usamos el alias, solo el valor
    }
};

  try {
    const result = await dynamo.query(params).promise();
    return { 
      statusCode: 200,
      body: JSON.stringify({ tasks: result.Items }),
    }
  } catch (error) {
    const errMsg = (error as Error).message;
    return { 
      statusCode: 500,
      body: JSON.stringify({ error: errMsg })
    };
  }
};
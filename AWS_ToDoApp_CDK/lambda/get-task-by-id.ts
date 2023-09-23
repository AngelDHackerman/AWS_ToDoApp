
// TODO: Refactor for dependency injection, now wer are crearting an instance of the DynamoDb table for each lambda function

import { validateTaskId } from './helpers/helpers';
import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();

interface LambdaEvent { 
  pathParameters?: {
    taskId?: string;
  };
};

exports.handler = async (event: LambdaEvent) => { 
  // Verificar si el ID de la tarea está presente en los parámetros de la ruta
  const taskId = event.pathParameters?.taskId;
  
  if (!taskId) { 
    return { 
      statusCode: 400,
      body: JSON.stringify({ error: 'Task ID is required' }),
    };
  }

  // TODO: agregar una validacion si el taskID existe en la base de datos. Buscar por ambos parametros taskId y dueDate (trabajar solo por 1 ID no funciono) 
  // codigo aqui. 

  // Configurar los parámetros para la consulta
  const params: AWS.DynamoDB.DocumentClient.QueryInput = { 
    TableName: process.env.TABLE_NAME!,
    KeyConditionExpression: "taskId = :taskIdValue",
    ExpressionAttributeValues: { 
      ":taskIdValue": taskId 
    }
  };

  try {
    const result = await dynamo.query(params).promise();
    if (result.Items && result.Items.length > 0) { 
      return { 
        statusCode: 200,
        body: JSON.stringify(result.Items[0]),
      };
    } else { 
      return { 
        statusCode: 404,
        body: JSON.stringify({ error: 'Task not found' }),
      };
    }
  } catch (error) {
    const errMsg = (error as Error).message;
    return { 
      statusCode: 500,
      body: JSON.stringify({ error: errMsg }),
    };
  }
};
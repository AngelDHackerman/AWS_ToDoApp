
// TODO: Refactor for dependency injection, now wer are crearting an instance of the DynamoDb table for each lambda function

import { validateTaskId } from './helpers/helpers';
import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();

interface LambdaEvent { 
  pathParameters?: {
    taskId?: string;
    timeStamp?: string;
  };
};

exports.handler = async (event: LambdaEvent) => { 
  // Verificar si el ID de la tarea está presente en los parámetros de la ruta
  const taskId = event.pathParameters?.taskId;
  const timeStamp = event.pathParameters?.timeStamp;
  
  if (!taskId || !timeStamp) { 
    return { 
      statusCode: 400,
      body: JSON.stringify({ error: 'Both taskId and timeStamp are required' }),
    };
  }

  // Configurar los parámetros para la consulta
  const params: AWS.DynamoDB.DocumentClient.QueryInput = { 
    TableName: process.env.TABLE_NAME!,
    KeyConditionExpression: "taskId = :taskIdValue AND timeStamp = :timeStampValue",
    ExpressionAttributeValues: { 
      ":taskIdValue": taskId,
      ":timeStampValue": timeStamp,
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
        body: JSON.stringify({ error: 'Task not found' }),  // ? si la task no existe, arroja este error diciendo que la task no existe.
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
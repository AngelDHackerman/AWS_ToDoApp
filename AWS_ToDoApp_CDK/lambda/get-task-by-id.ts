import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();

interface LambdaEvent { 
  pathParameters?: {
    taskId?: string;
  };
};

exports.handler = async (event: LambdaEvent) => { 
  // Verificar si el ID de la tarea esta presente en los parametros de la ruta
  const taskId = event.pathParameters?.taskId;
  if (!taskId) { 
    return { 
      statusCode: 400,
      body: JSON.stringify({ error: 'Task ID is required' }),
    };
  }

  // Configurar los parametros para la consulta
  const params: AWS.DynamoDB.DocumentClient.GetItemInput = { 
    TableName: process.env.TABLE_NAME!,
    Key: { 
      taskId: taskId
    }
  };

  try {
    const result = await dynamo.get(params).promise()
    if (result.Item) { 
      return { 
        statusCode: 200,
        body: JSON.stringify(result.Item),
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
      body: JSON.stringify({ error: errMsg}),
    };
  }
};
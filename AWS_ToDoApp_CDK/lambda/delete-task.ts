import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient()

interface LambdaEvent { 
  pathParameters?: { 
    taskId?: string,
    timeStamp?: string,
  }
}

exports.handler = async (event: LambdaEvent) => { 
  const taskId = event.pathParameters?.taskId;
  const timeStamp = event.pathParameters?.timeStamp;

  if (!taskId || !timeStamp) { 
    return { 
      statusCode: 400,
      body: JSON.stringify({ error: 'Both taskId and timeStamp are required'})
    }
  };

  // Seteando parametros para eliminar el taskId y timeStamp proporcionados
  const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = { 
    TableName: process.env.TABLE_NAME!,
    Key: { 
      taskId,
      timeStamp,
    },
  };

  try {
    await dynamo.delete(params).promise();
    return { 
      statusCode: 200,
      body: JSON.stringify({ message: 'Task deleted successfully' }),
    }
  } catch (error) {
    const errMsg = (error as Error).message
    return { 
      statusCode: 500,
      body: JSON.stringify({ error: errMsg })
    }
  }
}
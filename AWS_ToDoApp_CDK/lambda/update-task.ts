
// TODO: Refactor for dependency injection, now wer are crearting an instance of the DynamoDb table for each lambda function

import { validateTaskId } from './helpers/helpers';
import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();

interface LambdaEvent { 
  pathParameters?: { 
    taskId?: string,
  };
  body: string
}
exports.handler = async (event: LambdaEvent) => { 
  const taskId = event.pathParameters?.taskId;
  const body = JSON.parse(event.body);
  const { status, dueDate } = body;

  // Validacion si se recibe un taskId
  if (!taskId || !dueDate) { 
    return { 
      statusCode: 400,
      body: JSON.stringify( { error: 'Both taskId and dueDate are required'})
    };
  }

  // TODO: agregar una validacion si el taskID existe en la base de datos. Buscar por ambos parametros taskId y dueDate (trabajar solo por 1 ID no funciono) 
  const getParams = {
    TableName: process.env.TABLE_NAME!,
    Key: { 
      taskId,  // Clave de partición
      dueDate  // Clave de ordenación
    }
  };
  const checkIfExists = await dynamo.get(getParams).promise();
  if (!checkIfExists.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "Task not found" }),
    };
  }

  const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = { 
    TableName: process.env.TABLE_NAME!,
    Key: { taskId, dueDate }, 
    // Esta es una cadena que define las acciones que se realizarán en los atributos del ítem. En este caso, estás estableciendo (o actualizando) los valores de dos atributos: uno que se refiere con #statusAttribute y otro que se llama directamente dueDate.
    // #statusAttribute: Es un nombre de atributo reservado. En DynamoDB, si estás usando palabras reservadas o quieres evitar problemas con nombres de atributos que podrían ser palabras reservadas en el futuro, puedes usar esta notación. :statusValue y :dueDateValue: Son los valores que quieres establecer para esos atributos. Estos valores se definen en ExpressionAttributeValues.
    UpdateExpression: "set #statusAttribute = :statusValue, dueDate = :dueDateValue",
    // Aquí estás definiendo lo que realmente significa #statusAttribute. En este caso, estás diciendo que cuando uses #statusAttribute en tu UpdateExpression, en realidad te estás refiriendo al atributo status en DynamoDB.
    ExpressionAttributeNames: { 
      '#statusAttribute': 'status'
    },
    // Aquí estás definiendo los valores para los marcadores de posición que usaste en UpdateExpression. Estás diciendo que :statusValue debe reemplazarse por el valor de status y :dueDateValue debe reemplazarse por el valor de dueDate que obtuviste del cuerpo del evento.
    ExpressionAttributeValues: { 
      ':statusValue': status,
      ':dueDateValue': dueDate,
    },
    ReturnValues: "UPDATED_NEW"
  };

  try {
    const result = await dynamo.update(params).promise();
    return { 
      statusCode: 200,
      body: JSON.stringify( { message: 'Task updated successfully', updatedAttributes: result.Attributes})
    }
  } catch (error) {
    const errMsg = (error as Error).message;
    return { 
      statusCode: 500,
      body: JSON.stringify({ error: errMsg }),
    }
  }
}
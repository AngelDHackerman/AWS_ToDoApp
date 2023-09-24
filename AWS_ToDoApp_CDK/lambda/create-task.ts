// Esta funcion crea task en la base de datos de DynamoDB
//  tendrá un TTL de 7 días desde el momento de su creación. 

// TODO: Refactor for dependency injection, now wer are crearting an instance of the DynamoDb table for each lambda function

import { TaskStatus } from "./utils/task-status";

interface LambdaEvent {
  body: string;
}

const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: LambdaEvent) => {
  const body = JSON.parse(event.body);
  const { taskId, dueDate, status, description } = body;

  // Validacion para taskId y dueDate
  if (!taskId || !dueDate) { 
    return { 
      statusCode: 400,
      body: JSON.stringify({ error: 'taskId and dueDate are required fields' }),
    }
  }

  // Verifica si el status proporcionado es valido, sino lanzara un error
  if (!Object.values(TaskStatus).includes(status)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid status value' }),
    }
  }

  const timeStamp = Date.now().toString(); // Añadido timeStamp como sort key

  const params = {
    TableName: process.env.TABLE_NAME, // El nombre de la tabla se pasa como variable de entorno
    Item: {
      taskId,
      timeStamp,
      dueDate,
      description,
      status: status || TaskStatus.PENDING,  // si no se proporciona un status, se establecera en 'peding' por defecto. 
      expiryDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // TTL de 7 días
    },
  };

  // Verificar si el taskId ya existe en la base de datos
  const checkParams: AWS.DynamoDB.DocumentClient.QueryInput = { 
    TableName: process.env.TABLE_NAME!,
    KeyConditionExpression: "taskId = :taskIdValue",
    ExpressionAttributeValues: { 
      ":taskIdValue": taskId
    },
  };

  const checkResult = await dynamo.query(checkParams).promise();
  if (checkResult.Items && checkResult.Items.length > 0) { 
    return { 
      statusCode: 400,
      body: JSON.stringify({ error: "Task ID already exists" }),
    };
  }

  try {
    await dynamo.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Task added successfully" }),
    };
  } catch (error) {
    // Hacemos un type assertion aqui
    const errMsg = (error as Error).message;
    return {
      statusCode: 500,
      body: JSON.stringify({ error: errMsg }),
    };
  }
};

import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();  // DocumentClient es una interfaz de alto nivel en el SDK de AWS que proporciona métodos para realizar operaciones en DynamoDB sin tener que trabajar directamente con los tipos de datos nativos de DynamoDB. Es más fácil y conveniente para trabajar con datos en formato JSON.

export.handler = async (event) => { 
  const body = JSON.parse(event.body);
  const { taskId, dueDate } = body  // parametros que debe recibir la base de datos de dynamo

  const params = { 
    TableName: process.env.TABLE_NAME, // El nombre de la tabla se pasa como variable de entorno. 
    Item: { 
      taskId,
      dueDate,
      expiryDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7  // TTL de 7 dias

    }
  };
}
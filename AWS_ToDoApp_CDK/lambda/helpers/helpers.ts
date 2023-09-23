
// todo: mejorar para que busque por ambos parametros taskId y dueDate, buscar por solo 1 elemento no funciona bien.

import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();

export async function validateTaskId(taskId: string, tableName: string): Promise<boolean> {
  const getItemParams: AWS.DynamoDB.DocumentClient.GetItemInput = { 
    TableName: tableName,
    Key: { taskId }
  };

  const itemResult = await dynamo.get(getItemParams).promise()
  return !!itemResult.Item;
}
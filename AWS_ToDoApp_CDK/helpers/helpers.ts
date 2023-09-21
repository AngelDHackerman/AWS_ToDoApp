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
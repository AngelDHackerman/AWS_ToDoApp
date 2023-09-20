import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();

interface LambdaEvent { 
  pathParameters?: {
    taskId?: string;
  };
};
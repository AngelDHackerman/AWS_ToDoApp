interface LambdaEvent { 
  body: string;
}

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event: LambdaEvent) => {
    const body = JSON.parse(event.body);
    const { taskId, dueDate } = body;

    const params = {
        TableName: process.env.TABLE_NAME,  // El nombre de la tabla se pasa como variable de entorno
        Item: {
            taskId,
            dueDate,
            expiryDate: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7  // TTL de 7 días
        }
    };

    try {
        await dynamo.put(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Task added successfully' }),
        };
    } catch (error) {
      // Hacemos un type assertion aqui
      const errMsg = (error as Error).message
        return {
            statusCode: 500,
            body: JSON.stringify({ error: errMsg }),
        };
    }
};

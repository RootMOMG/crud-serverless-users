const aws = require('aws-sdk');

let dynamoDBClientParams = {}

if(process.env.IS_OFFLINE) {
    dynamoDBClientParams = {
        region: 'localhost',
        endpoint: 'http://localhost:8000',
        accessKeyId: 'DEFAULTACCESSKEY',  // needed if you don't have aws credentials at all in env
        secretAccessKey: 'DEFAULTSECRET' // needed if you don't have aws credentials at all in env
    }
}

const dynamonDB = new aws.DynamoDB.DocumentClient(dynamoDBClientParams);

const updateUsers = async (event, context) => {

    let userId = event.pathParameters.id
    const body = JSON.parse(event.body);

    let params = {
        TableName: 'usersTable',
        Key: {pk: userId},
        UpdateExpression: 'set #name = :name',
        ExpressionAttributeNames: { '#name': 'name' },
        ExpressionAttributeValues: { 
            ':name': body.name },
        ReturnValues: 'ALL_NEW'
    };

    return dynamonDB.update(params).promise().then(res =>{
        console.log(res);
        return {
            "statusCode": 200,
            "body": JSON.stringify({ "user": res.Attributes })
        }
    })
}

module.exports = {
    updateUsers
}
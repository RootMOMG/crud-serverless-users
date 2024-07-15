const aws = require('aws-sdk');
const { randomUUID } = require("crypto")

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

const createUsers = async (event, context) => {

    const id = randomUUID();

    let userBody =  JSON.parse(event.body);

    userBody.pk = id;

    let params = {
        TableName: 'usersTable',
        Item: userBody
    };

    console.log(params.Item);

    return dynamonDB.put(params).promise().then(res =>{
        console.log(res);
        return {
            "statusCode": 200,
            "body": JSON.stringify({ "user": params.Item })
        }
    })
}

module.exports = {
    createUsers
}
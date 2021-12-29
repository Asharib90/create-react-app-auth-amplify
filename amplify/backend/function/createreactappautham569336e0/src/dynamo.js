const aws = require('aws-sdk')
require('dotenv').config();

aws.config.update({
    region: 'us-east-2',
    accessKeyId: '',
    secretAccessKey: ''
})      

const dynamoClient = new aws.DynamoDB.DocumentClient()
const TABLE_NAME = 'starFormData'

const getForm = async() =>{ 
    const params = {
        TableName: TABLE_NAME
    };
    const data = await dynamoClient.scan(params).promise();
    return data;
}

const addOrUpdateForm = async(data) =>{
    const params = {
        TableName: TABLE_NAME,
        Item: data
    }
    return await dynamoClient.put(params).promise();
}

module.exports ={
    getForm:getForm,
    addOrUpdateForm:addOrUpdateForm,  
}
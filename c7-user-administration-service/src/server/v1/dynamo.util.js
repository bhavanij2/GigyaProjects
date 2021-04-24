import AWS from 'aws-sdk';

const dynamoDocClient = () => {
  const awsConfig = {
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
    region: 'us-east-1',
  };
  AWS.config.update(awsConfig);
  return new AWS.DynamoDB.DocumentClient();
};

export default dynamoDocClient;

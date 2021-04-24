import AWS from 'aws-sdk';
import moment from 'moment';
import uuid from 'uuid/v1';

const awsConfigUpdate = () => {
  AWS.config.update({
    accessKeyId: process.env.aws_access_key_id,
    secretAccessKey: process.env.aws_secret_access_key,
  });
};

export const sqs = () => {
  awsConfigUpdate();
  return new AWS.SQS({ region: 'us-east-1' });
};

export const sendSqsMessage = async (sqsConn, queueAlias, message) => {
  awsConfigUpdate();
  const sqsParams = {
    MessageBody: JSON.stringify(message),
    QueueUrl: queueAlias,
  };

  try {
    const result = await sqsConn.sendMessage(sqsParams).promise();
    return result;
  }
  catch (error) {
    console.log('sendSqsMessage error', error);
    throw error;
  }
};

export const sendAuditMessage = async (action, field, from, to, updatedBy = 'SYSTEM', transactionId = uuid()) => {
  await sendSqsMessage(sqs(), process.env.audit_log_sqs_name, {
    updatedBy,
    updatedTimestamp: moment().format(),
    transactionId,
    application: 'User Admin',
    action,
    field,
    from,
    to,
  });
};

export const syncNewUserToCu360 = async addUserRequestBody => {
  await sendSqsMessage(sqs(), process.env.cu360_user_sync_sqs_name, addUserRequestBody);
};
